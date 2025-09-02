import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);


app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})