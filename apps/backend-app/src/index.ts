import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(
    cors({
      origin: "http://localhost:3000", // your frontend URL
      credentials: true, // if sending cookies or auth headers
    })
  );

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/listing", listingRouter);


app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})