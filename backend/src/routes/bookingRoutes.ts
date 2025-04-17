import express, { Request, Response } from 'express';
import prisma from '../prismaClient';
import { HttpStatus } from "../httpStatus";
import { authBookingFilter } from '../middleware/authBookingFilter'; //Work in progress
import { BookingData, BookingFilter } from '../interfaces';
import { auth } from '../middleware/auth';
import { userSocketMap } from '../socket';

const router = express.Router();

//Create a booking
router.post("/", auth(['create']), async (req: Request, res: Response) => {
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
            req.app.get('io').to(socketId).emit('booking-created', { booking });
        }
        res.status(HttpStatus.CREATED).json({ booking });
    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

//Get bookings
router.get("/:id", auth(['read']), async (req: Request, res: Response) => {
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
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

router.get("/filter", auth(['read']), /*authBookingFilter,*/ async (req: Request, res: Response) => {
    const {room, user} = req.body as BookingFilter;

    try {
        const filteredBookings = await prisma.booking.findMany({
            where: {
                OR: [
                    {
                        room
                    },
                    {
                        AND: {
                            user
                        }
                    },
                ],
            },
        });
        res.status(HttpStatus.OK).json({ filteredBookings });
    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

//Edit a booking
router.patch("/:id", auth(['update']), async (req: Request, res: Response) => {
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
            req.app.get('io').to(socketId).emit('booking-updated', { message: 'Successfully updated booking.' });
        }
        res.status(HttpStatus.OK).send({ message: 'Successfully updated booking.' });
    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

//Delete a booking
router.delete("/:id", auth(['delete']), async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const deleteBooking = await prisma.booking.delete({
            where: {
                id
            }
        });
        res.status(HttpStatus.OK).send({ message: 'Successfully deleted booking.' });
    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

export default router;