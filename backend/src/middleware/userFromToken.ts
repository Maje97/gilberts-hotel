import {NextFunction, Response} from "express";
import { HttpStatus } from "../httpStatus";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomJwtPayload } from "../interfaces";

dotenv.config();
const secret = process.env.JWT_SECRET as string

export const userFromToken = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(HttpStatus.NOT_AUTHENTICATED).send('No token was recieved.');
    
    const payload = jwt.verify(token, secret) as CustomJwtPayload;
    if (!payload) {
        return res.status(HttpStatus.NOT_AUTHENTICATED).send('Token is not valid');
    }

    req.jwtPayload = payload

    next()
}