
import { Router } from "express";
import { signUp } from "../controller/authController.js";

const authRouter = Router();

authRouter.post('/signup', signUp);

export default authRouter;