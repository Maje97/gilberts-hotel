import {NextFunction, Response} from "express";
import {Role} from "@prisma/client";
import { BookingFilter, CustomJwtPayload } from "../interfaces";
import { HttpStatus } from "../httpStatus";

export function authBookingFilter() {
    return (req: any, res: Response, next: NextFunction): void => {
        const { id, role } = req.jwtPayload as CustomJwtPayload
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
