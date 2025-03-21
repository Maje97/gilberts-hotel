import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";
import dotenv from "dotenv";
import { User, UserCredentials, CustomJwtPayload } from "../interfaces";
import { HttpStatus } from "../httpStatus";

dotenv.config();
const router = express.Router();

//Register new user
router.post("/register", async (req, res) => {
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
        { username: user.username, role: user.role } as CustomJwtPayload, 
        process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });
    res.status(HttpStatus.CREATED).json({ id: user.id, token: token });
  } catch (err) {
    console.log(err);
    res.status(HttpStatus.SERVICE_UNAVAILABLE);
  }
});

//Login user
router.post("/login", async (req, res) => {
  const credentials = req.body as UserCredentials;

  try {
    const storedUser = await prisma.user.findUnique({
      where: {
        username: credentials.username,
      },
    });
    if (!storedUser) {
      res.status(HttpStatus.NOT_FOUND).send({ message: "User not found" });
      return;
    }

    const comparePassword = bcrypt.compareSync(
      credentials.password,
      storedUser.password
    );
    if (!comparePassword) {
      res
        .status(HttpStatus.NOT_AUTHORIZED)
        .send({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      { username: storedUser.username, role: storedUser.role } as CustomJwtPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.status(HttpStatus.OK).json({ token });
  } catch (err) {
    console.log(err);
    res.status(HttpStatus.SERVICE_UNAVAILABLE);
  }
});

export default router;
