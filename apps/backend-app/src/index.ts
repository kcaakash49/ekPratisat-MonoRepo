import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hey I am Backend");
})


app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})