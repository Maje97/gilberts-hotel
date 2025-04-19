import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient";
import dotenv from "dotenv";
import { User, UserCredentials, CustomJwtPayload } from "../utils/interfaces";
import { HttpStatus } from "../utils/httpStatus";

dotenv.config();
const router = express.Router();

//Register new user
router.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body as UserCredentials;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    //Check if username is available.
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(HttpStatus.CONFLICT).json({
        error: 'Username taken',
        message: 'This username is already in use. Please choose another one.',
      });
    }

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
    
    res.status(HttpStatus.CREATED).json({ 
      id: user.id, 
      username, 
      role: user.role, 
      token 
    });

  } catch (err) {
    console.log(err);
    res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
      error: 'Service unavailable', 
      message: 'An error has occured. Try again later.' 
    });
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
      res.status(HttpStatus.NOT_FOUND).json({ 
        error: "User not found",
        message: "User not found, check username or password." 
      });
      return;
    }

    const comparePassword = bcrypt.compareSync(
      credentials.password,
      storedUser.password
    );
    if (!comparePassword) {
      res
        .status(HttpStatus.NOT_AUTHORIZED)
        .json({ 
          error: "Invalid password",
          message: "Invalid password, check for possible spelling error or caps lock." 
        });
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
    res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ 
      error: 'Service unavailable',
      message: "Service seems to be currently unavailable. Please try later." 
    });
  }
});

export default router;
