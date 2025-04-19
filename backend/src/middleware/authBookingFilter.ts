import {NextFunction, Request, Response} from "express";
import {Role} from "@prisma/client";
import { BookingFilter, CustomJwtPayload } from "../utils/interfaces";
import { HttpStatus } from "../utils/httpStatus";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET as string

export function authBookingFilter() {
    return (req: Request, res: Response, next: NextFunction): void => {
        const token = req.headers['authorization'];
        if (!token) { 
            void res.status(HttpStatus.NOT_AUTHENTICATED).send('No token was recieved.');
            return
        }
                    
        let payload: CustomJwtPayload;
        try {
            payload = jwt.verify(token, secret) as CustomJwtPayload;
        } catch (err) {
            void res.status(HttpStatus.NOT_AUTHENTICATED).send('Token is not valid');
            return; 
        }

        const { id, role } = payload as CustomJwtPayload
        const { user } = req.body as BookingFilter;

        // Skip authorization if admin.
        if (role === Role.ADMIN) next();

        // If user tries to access other users bookings, decline user.
        if (id !== user) {
            void res.status(HttpStatus.NOT_AUTHORIZED).send('User is not authorized, access declined.');
            return;
        }

        next();
    };
}
