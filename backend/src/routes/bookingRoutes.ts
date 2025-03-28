import express from 'express';
import prisma from '../prismaClient';
import { HttpStatus } from "../httpStatus";
import { authBooking } from '../middleware/authBooking';

const router = express.Router();

//Create a booking
router.post("/", authBooking(['create']), async (req, res) => {

    try {

    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

//Get bookings
router.get("/:id", authBooking(['read']), async (req, res) => {

    try {

    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

//Edit a booking
router.patch("/:id", authBooking(['update']), async (req, res) => {

    try {

    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

//Delete a booking
router.delete("/:id", authBooking(['delete']), async (req, res) => {

    try {

    } catch (err) {
        console.log(err);
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
});

export default router;