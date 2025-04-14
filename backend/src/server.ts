import express, {Express} from 'express';
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes';
import roomRoutes from './routes/roomRoutes';
import bookingRoutes from './routes/bookingRoutes';
import { userFromToken } from './middleware/userFromToken';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

//Middlewares
app.use(express.json());

//Routes
app.use('/user', userRoutes);
app.use('/room', roomRoutes);
app.use('/booking', bookingRoutes);

app.listen(port, () => {
    console.log(`Server has started on port: ${port}`);
});
