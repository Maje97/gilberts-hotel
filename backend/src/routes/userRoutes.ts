import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';
import { User, UserCredentials } from '../interfaces';

const router = express.Router();

//Register new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body as UserCredentials
    const hashedPassword = bcrypt.hashSync(password, 8)

    try {
        const user: User = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {}
});

//Login user
