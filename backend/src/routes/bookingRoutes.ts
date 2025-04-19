import express, { Request, Response } from 'express';
import prisma from '../utils/prismaClient';
import { HttpStatus } from "../utils/httpStatus";
import { BookingData } from '../utils/interfaces';
import { userSocketMap } from '../utils/socket';
import { authBooking } from '../middleware/authBooking';
import { Role } from '@prisma/client';
import { authBookingOwner } from '../middleware/authBookingOwner';

const router = express.Router();

//Create a booking
router.post("/", authBooking(['create']), async (req: Request, res: Response) => {
    const {room, user, startTime, endTime} = req.body as BookingData;

    try {
        const booking = await prisma.booking.create({
            data: {
                roomId: room,
                userId: user,
                startTime,
                endTime
            }
        })
        const socketId = userSocketMap[user];

        if(socketId) {
            req.app.get('io').to(socketId).emit('booking-created', { 
                message: `Your booking with id ${booking.id} has been created.` 
            });
        }
        res.status(HttpStatus.CREATED).json({ booking });
    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});

//Get all bookings if admin, get your own bookings if user.
router.get("/", authBooking(['read']), async (req: Request, res: Response) => {
    
    try {
        if (res.locals.role === Role.ADMIN) {
            const bookings = await prisma.booking.findMany();
            res.status(HttpStatus.OK).json({ bookings });
        } else {
            const bookings = await prisma.bookings.findMany({
                where: {
                    userId: {
                        equals: res.locals.id
                    } 
                }
            });
            res.status(HttpStatus.OK).json({ bookings });
        }
    } catch (err) {
        console.log(err);
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
        console.log(err);
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
        const updateBooking = await prisma.booking.update({
            where: {
                id
            },
            data: {
                room,
                user,
                startTime,
                endTime
            }
        });
        const socketId = userSocketMap[user];
        if (socketId) {
            req.app.get('io').to(socketId).emit('booking-updated', { 
                message: `Successfully updated booking with id ${id}.` 
            });
        }
        res.status(HttpStatus.OK).json({ message: 'Successfully updated booking.' });
    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});

//Delete a booking
router.delete("/:id", authBookingOwner, async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const deleteBooking = await prisma.booking.delete({
            where: {
                id
            }
        });

        const socketId = userSocketMap[res.locals.id];
        if (socketId) {
            req.app.get('io').to(socketId).emit('booking-deleted', { 
                message: `Successfully deleted booking with id ${id}.` 
            });
        }

        res.status(HttpStatus.OK).json({ message: 'Successfully deleted booking.' });
    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});

export default router;