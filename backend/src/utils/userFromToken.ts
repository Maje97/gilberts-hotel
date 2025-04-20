import {Request} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomJwtPayload } from "./interfaces";

dotenv.config();
const secret = process.env.JWT_SECRET as string

export const userFromToken = async (req: Request): Promise<CustomJwtPayload | undefined> => {
    const token = req.headers['authorization'];
    if (!token) { 
        return undefined;
    }
            
    let payload: CustomJwtPayload;
    try {
        payload = jwt.verify(token, secret) as CustomJwtPayload;
        return payload;
    } catch (err) {
        return undefined;
    }
}