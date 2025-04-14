import {NextFunction, Response} from "express";
import {Role} from "@prisma/client";
import { BookingFilter, CustomJwtPayload } from "../interfaces";
import { HttpStatus } from "../httpStatus";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET as string

export function authBookingFilter() {
    return (req: any, res: Response, next: NextFunction): void => {
        const token = req.headers['authorization'];
        if (!token) { 
            res.status(HttpStatus.NOT_AUTHENTICATED).send('No token was recieved.');
            return
        }
                    
        const payload = jwt.verify(token, secret) as CustomJwtPayload;
        if (!payload) {
            res.status(HttpStatus.NOT_AUTHENTICATED).send('Token is not valid')
            return
        }

        const { id, role } = payload as CustomJwtPayload
        const { user } = req.body as BookingFilter;

        // Skip authorization if admin.
        if (role === Role.ADMIN) next();

        // If user tries to access other users bookings, decline user.
        if (id !== user) {
            res.status(HttpStatus.NOT_AUTHORIZED).send('User is not authorized, access declined.');
            return
        }

        next();
    };
}
