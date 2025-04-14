import {NextFunction, Response} from "express";
import {Role} from "@prisma/client";
import { CustomJwtPayload } from "../interfaces";
import { HttpStatus } from "../httpStatus";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET as string

type Permission = 'create' | 'read' | 'update' | 'delete'

type RolesWithPermissions = {
    [role in Role]: Permission[];
};

export function auth(requiredPermissions: Permission[]) {
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
        
        const RolePermissions: RolesWithPermissions = {
            [Role.ADMIN]: ['create', 'read', 'update', 'delete'],
            [Role.USER]: ['read'],
        };
        const {role} = payload as CustomJwtPayload
        const userPermissions = RolePermissions[role];

        // Skip authorization if admin.
        if (role === Role.ADMIN) next();

        //If user permissions are missing
        if (!userPermissions) {
            res.status(HttpStatus.NOT_AUTHORIZED).send('User is not authorized.')
            return
        }

        //Check if user has the required permission
        const hasRequiredPermissions = requiredPermissions.every(permission =>
            userPermissions.includes(permission)
        );

        //Decline user if not authorized, otherwise continue to next.
        if (!hasRequiredPermissions) {
            res.status(HttpStatus.NOT_AUTHORIZED).send('User is not authorized, access declined.');
            return
        }

        next();
    };
}