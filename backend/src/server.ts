import express, {Express} from 'express';
import dotenv from "dotenv";
import { HttpStatus } from './httpStatus';
import userRoutes from './routes/userRoutes';
import roomRoutes from './routes/roomRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

//Middlewares
app.use(express.json());
//Routes
app.use('/user', userRoutes);
app.use('/room', roomRoutes)
//app.use('/booking', bookingRoutes)

app.use((req, res) => {
    res.status(HttpStatus.NOT_FOUND).send('Sidan saknas.');
});

app.listen(port, () => {
    console.log(`Server has started on port: ${port}`);
});
