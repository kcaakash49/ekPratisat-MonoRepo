import express from 'express';
// import dotenv from 'dotenv';
import 'dotenv/config'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js';
import zoneRouter from './routes/zoneRoute.js';

// dotenv.config();

console.log(process.env.JWT_SECRET);

const PORT = process.env.PORT || 4000;

const app = express();

const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:3002",
  "https://ekpratishat.com",
  "https://www.ekpratishat.com",
  "https://admin.ekpratishat.com",
  "https://partner.ekpratishat.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/listing", listingRouter);
app.use("/zone", zoneRouter);


app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})