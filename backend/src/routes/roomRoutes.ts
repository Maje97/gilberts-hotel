import express from 'express';
import prisma from '../prismaClient';
import { HttpStatus } from "../httpStatus";
import { auth } from '../middleware/auth'; //Work in progress
import { RoomData, Room } from '../interfaces';

const router = express.Router();

//Create a room
router.post("/", auth(['create']), async (req, res) => {
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
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

//Get all rooms
router.get("/", auth(['read']), async (req, res) => {
    try {
        const rooms = await prisma.room.findMany();
        res.status(HttpStatus.OK).json({ rooms });
    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

//Update a room
router.patch("/:id", auth(['update']), async (req, res) => {
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
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

//Delete a room
router.delete("/:id", auth(['delete']), async (req, res) => {
    const id = Number(req.params.id);

    try {
        const deleteRoom = await prisma.room.delete({
            where: {
                id
            }
        });
        res.status(HttpStatus.OK).send({ message: 'Successfully deleted room.' });
    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

export default router;