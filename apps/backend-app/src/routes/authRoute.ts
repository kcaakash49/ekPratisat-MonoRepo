
import { Router } from "express";
import { createAgentAdminStaff, signIn, verifyAgent } from "../controller/authController.js";
import { checkAuthentication, requireAdminOrStaff } from "../middleware/checkAuthentication.js";
import { uploadUserFiles } from "../middleware/userUpload.js";

const authRouter = Router();

// authRouter.post('/signup', signUp);
authRouter.post("/signin", signIn);
authRouter.post("/create-agent",checkAuthentication,requireAdminOrStaff,uploadUserFiles.any(),createAgentAdminStaff);
authRouter.post("/verify-agent",checkAuthentication,requireAdminOrStaff,verifyAgent);



export default authRouter;