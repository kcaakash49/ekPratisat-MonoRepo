
import { Router } from "express";
import { createAgentAdminStaff, myInfo, signIn, signOut, verifyAgent } from "../controller/authController.js";
import { checkAuthentication, requireAdminOrStaff } from "../middleware/checkAuthentication.js";
import { uploadUserFiles } from "../middleware/userUpload.js";

const authRouter = Router();

// authRouter.post('/signup', signUp);
authRouter.post("/signin", signIn);
authRouter.post("/create-agent",checkAuthentication,requireAdminOrStaff,uploadUserFiles.any(),createAgentAdminStaff);
authRouter.post("/verify-agent",checkAuthentication,requireAdminOrStaff,verifyAgent);
authRouter.post("/signout",signOut);
authRouter.get("/my-info",myInfo);




export default authRouter;