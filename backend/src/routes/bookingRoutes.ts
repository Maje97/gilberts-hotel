import express, { Request, Response } from 'express';
import prisma from '../utils/prismaClient';
import { HttpStatus } from "../utils/httpStatus";
import { BookingData } from '../utils/interfaces';
import { userSocketMap } from '../utils/socket';
import { authBooking } from '../middleware/authBooking';
import { Role } from '@prisma/client';
import { authBookingOwner } from '../middleware/authBookingOwner';
import { userFromToken } from '../utils/userFromToken';
import { isRoomAvailable } from '../utils/bookingUtils';
import logger from '../utils/logger';

const router = express.Router();

//Create a booking
router.post("/", authBooking(['create']), async (req: Request, res: Response) => {
    const {room, user, startTime, endTime} = req.body as BookingData;
    
    try {
        const available = await isRoomAvailable(room, new Date(startTime), new Date(endTime));
        const socketId = userSocketMap[user];

        if (!available) {
            if(socketId) {
                req.app.get('io').to(socketId).emit('booking-created', `Your booking can not be created due to availability issues.`);
            } else {
                logger.warn(`Failed to emit socket message when creating booking. Potentially missing socket id: ${socketId}`);
            }
            logger.warn(`An attempt to double book a room was made: Room#${room}, start: ${startTime}, end: ${endTime}`);
            return res.status(HttpStatus.CONFLICT).json({
                error: 'Room not available',
                message: 'The room is already booked for the selected time range.'
            });
        }

        const booking = await prisma.booking.create({
            data: {
                roomId: room,
                userId: user,
                startTime: new Date(startTime),
                endTime: new Date(endTime)
            }
        })
        
        if(socketId) {
            req.app.get('io').to(socketId).emit('booking-created', `Your booking with id ${booking.id} has been created.`);
        } else {
            logger.warn(`Failed to emit socket message when creating booking. Potentially missing socket id: ${socketId}`);
        }

        logger.info(`Booking created: ${booking}`);
        res.status(HttpStatus.CREATED).json({ booking });
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});

//Get all bookings if admin, get your own bookings if user.
router.get("/", authBooking(['read']), async (req: Request, res: Response) => {
    const payload = await userFromToken(req);
    
    try {
        if (payload?.role === Role.ADMIN) {
            const bookings = await prisma.booking.findMany();
            res.status(HttpStatus.OK).json({ bookings });
        } else if (payload) {
            const bookings = await prisma.booking.findMany({
                where: {
                    userId: payload.id
                }
            });
            res.status(HttpStatus.OK).json({ bookings });
        } else {
            logger.error(`Failed to get bookings. Payload: ${payload}`);
            res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
                error: 'Service unavailable', 
                message: 'An error has occured. Try again later.' 
            });
        }
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});

//Get booking
router.get("/:id", authBookingOwner, async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const booking = await prisma.booking.findUnique({
            where: {
                id
            },
        });
        res.status(HttpStatus.OK).json({ booking });
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});


//Edit a booking
router.patch("/:id", authBookingOwner, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {room, user, startTime, endTime} = req.body as BookingData;
    
    try {
        const available = await isRoomAvailable(room, new Date(startTime), new Date(endTime), id);
        const socketId = userSocketMap[user];

        if (!available) {
            logger.warn(`An attempt to double book a room was made: Room#${room}, start: ${startTime}, end: ${endTime}`);
            if (socketId) {
                req.app.get('io').to(socketId).emit('booking-updated', `Could not updated booking with id ${id}.`);
            } else {
                logger.warn(`Failed to emit socket message when updating booking. Potentially missing socket id: ${socketId}`);
            }
            return res.status(HttpStatus.CONFLICT).json({
                error: 'Room not available',
                message: 'The room is already booked for the selected time range.'
            });
        }

        const updateBooking = await prisma.booking.update({
            where: {
                id
            },
            data: {
                roomId: room,
                userId: user,
                startTime,
                endTime
            }
        });
        
        if (socketId) {
            req.app.get('io').to(socketId).emit('booking-updated', `Successfully updated booking with id ${id}.`);
        } else {
            logger.warn(`Failed to emit socket message when updating booking. Potentially missing socket id: ${socketId}`);
        }
        res.status(HttpStatus.OK).json({ message: 'Successfully updated booking.' });
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});

//Delete a booking
router.delete("/:id", authBookingOwner, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload = await userFromToken(req);

    try {
        const deleteBooking = await prisma.booking.delete({
            where: {
                id
            }
        });

        if (payload) {
            const socketId = userSocketMap[payload.id];
            if (socketId) {
                req.app.get('io').to(socketId).emit('booking-deleted', `Successfully deleted booking with id ${id}.`);
            } else {
                logger.warn(`Failed to emit socket message when deleting booking. Potentially missing socket id: ${socketId}`);
            }
        } else {
            logger.warn(`Failed to emit socket message when updating booking due to missing payload.`);
        }
        
        res.status(HttpStatus.OK).json({ message: 'Successfully deleted booking.' });
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});

export default router;