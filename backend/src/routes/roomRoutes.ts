import express, { Request, Response } from 'express';
import prisma from '../utils/prismaClient';
import { HttpStatus } from "../utils/httpStatus";
import { auth } from '../middleware/auth'; //Work in progress
import { RoomData, Room } from '../utils/interfaces';
import logger from '../utils/logger';

const router = express.Router();

//Create a room
router.post("/", auth(['create']), async (req: Request, res: Response) => {
    const {image, name, capacity, type} = req.body as RoomData;

    try {
        const room: Room = await prisma.room.create({
            data: {
                image,
                name,
                capacity,
                type
            }
        })
        res.status(HttpStatus.CREATED).json({ id: room.id, type: room.type });
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable',
            message: 'An error has occured. Try again later.'  
        });
    }
});

//Get all rooms
router.get("/", auth(['read']), async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany();
        res.status(HttpStatus.OK).json({ rooms });
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});

//Get a specific room
router.get("/:id", auth(['read']), async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const room = await prisma.room.findUnique({
            where: {
                id
            },
        });
        res.status(HttpStatus.OK).json({ room });
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});

//Get booked dates for specific room
router.get("/availability/:roomId", async (req: Request, res: Response) => {
    const roomId = Number(req.params.roomId);

    try {
        const bookings = await prisma.booking.findMany({
            where: { roomId },
            select: {
                startTime: true,
                endTime: true
            }
        });

        res.status(HttpStatus.OK).json({ bookings });
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: 'Could not fetch availability'
        });
    }
});

//Update a room
router.patch("/:id", auth(['update']), async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {image, name, capacity, type} = req.body as RoomData;

    try {
        const updateRoom = await prisma.room.update({
            where: {
                id
            },
            data: {
                image,
                name,
                capacity,
                type
            }
        });
        res.status(HttpStatus.OK).send({ message: 'Successfully updated room.' });
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});

//Delete a room
router.delete("/:id", auth(['delete']), async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const deleteRoom = await prisma.room.delete({
            where: {
                id
            }
        });
        res.status(HttpStatus.OK).send({ message: 'Successfully deleted room.' });
    } catch (err) {
        logger.error(`Error: ${err}`);
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
    }
});

export default router;