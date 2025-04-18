import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";
import dotenv from "dotenv";
import { User, UserCredentials, CustomJwtPayload } from "../interfaces";
import { HttpStatus } from "../httpStatus";
import { userSocketMap } from "../socket";

dotenv.config();
const router = express.Router();

//Register new user
router.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body as UserCredentials;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user: User = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
        { id: user.id, role: user.role } as CustomJwtPayload, 
        process.env.JWT_SECRET as string, {
        expiresIn: "6h",
    });
    const socketId = userSocketMap[user.id];
    
    if(socketId) {
      req.app.get('io').to(socketId).emit('login', { token });
    }
    res.status(HttpStatus.CREATED).json({ 
      id: user.id, 
      username, 
      role: user.role, 
      token 
    });
  } catch (err) {
    console.log(err);
    res.status(HttpStatus.SERVICE_UNAVAILABLE);
  }
});

//Login user
router.post("/login", async (req: Request, res: Response) => {
  const credentials = req.body as UserCredentials;

  try {
    const storedUser = await prisma.user.findUnique({
      where: {
        username: credentials.username,
      },
    });
    if (!storedUser) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
      return;
    }

    const comparePassword = bcrypt.compareSync(
      credentials.password,
      storedUser.password
    );
    if (!comparePassword) {
      res
        .status(HttpStatus.NOT_AUTHORIZED)
        .json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      { id: storedUser.id, role: storedUser.role } as CustomJwtPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: "6h" }
    );
    res.status(HttpStatus.OK).json({ 
      id: storedUser.id, 
      username: storedUser.username, 
      role: storedUser.role, 
      token 
    });
  } catch (err) {
    console.log(err);
    res.status(HttpStatus.SERVICE_UNAVAILABLE);
  }
});

export default router;
