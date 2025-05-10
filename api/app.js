import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRouter from './Routes/auth.js';
import movieRouter from './Routes/movie.js';
import showtimeRouter from './Routes/showtime.js';
import seatRouter from './Routes/seat.js';
import reservationRouter from './Routes/reservation.js';
import userRouter from './Routes/user.js';
import reportRouter from './Routes/report.js';
import { isLogin } from './Middlewares/isLogin.js';
import { isAdmin } from './Middlewares/isAdmin.js';
import { catchError,HandleERROR } from 'vanta-api';
import uploadRouter from './Routes/upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static('Public'));


app.use('/api/auth', authRouter);
app.use('/api/movies', movieRouter);
app.use('/api/showtime', showtimeRouter);
app.use('/api/seats', seatRouter);
app.use('/api/reservations',  reservationRouter);
app.use('/api/users', isLogin, userRouter);
app.use('/api/reports', isAdmin, reportRouter);

app.use('/api/upload',uploadRouter)


app.use( (req, res, next) => {
  return next(new HandleERROR('Route not found', 404));
});
app.use(catchError);

export default app;
