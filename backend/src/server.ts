import express, {Express} from 'express';
import dotenv from "dotenv";
import http from 'http';
import { Server } from "socket.io";
import userRoutes from './routes/userRoutes';
import roomRoutes from './routes/roomRoutes';
import bookingRoutes from './routes/bookingRoutes';
import { setupSocket } from './utils/socket';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT;
const origin = process.env.CLIENT_ORIGIN;

const io = new Server(server, { 
    cors: {
        origin,
        credentials: true,
    }
});

setupSocket(io);

//Middlewares
app.use(cors({ origin, credentials: true }));
app.use(express.json());

// Save io to use in routes or services
app.set('io', io);

//Routes
app.use('/user', userRoutes);
app.use('/room', roomRoutes);
app.use('/booking', bookingRoutes);

server.listen(port, () => {
    console.log(`Server has started on port: ${port}`);
});
