import {Request} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomJwtPayload } from "./interfaces";

dotenv.config();
const secret = process.env.JWT_SECRET as string

export const userFromToken = async (req: Request): Promise<CustomJwtPayload | null> => {
    const token = req.headers['authorization'];
    if (!token) { 
        return null;
    }
            
    let payload: CustomJwtPayload;
    try {
        payload = jwt.verify(token, secret) as CustomJwtPayload;
        return payload;
    } catch (err) {
        return null;
    }
}