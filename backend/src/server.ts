import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
const port = process.env.PORT || 8080;

//Middlewares

//Routes
app.use('/user', userRoutes)
//app.use('/room', roomRoutes)
//app.use('/booking', bookingRoutes)

app.listen(port, () => {
    console.log(`Server has started on port: ${port}`)
})
