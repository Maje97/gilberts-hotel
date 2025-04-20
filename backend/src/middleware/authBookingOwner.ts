import {NextFunction, Request, Response} from "express";
import {Booking, Role} from "@prisma/client";
import { CustomJwtPayload } from "../utils/interfaces";
import { HttpStatus } from "../utils/httpStatus";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../utils/prismaClient";

dotenv.config();
const secret = process.env.JWT_SECRET as string

export async function authBookingOwner(req: Request, res: Response, next: NextFunction) {
    const bookingId = Number(req.params.id);
    const token = req.headers['authorization'];

    if (!token) { 
        void res.status(HttpStatus.NOT_AUTHENTICATED).send('No token was recieved.');
        return;
    }
    
    let payload: CustomJwtPayload;
    try {
        payload = jwt.verify(token, secret) as CustomJwtPayload;
    } catch (err) {
        void res.status(HttpStatus.NOT_AUTHENTICATED).send('Token is not valid');
        return; 
    }
    const { id } = payload;

    let booking: Booking
    try {
        booking = await prisma.booking.findUnique({
            where: {
                id: bookingId
            }
        })
    } catch (err) {
        void res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
            error: 'Service unavailable', 
            message: 'An error has occured. Try again later.' 
        });
        return;
    }

    if (id === booking.userId) next();

    res.status(HttpStatus.NOT_AUTHORIZED).send('User is not authorized.');
}