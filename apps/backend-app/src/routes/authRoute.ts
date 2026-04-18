
import { Router } from "express";
import { createAgentAdminStaff, createClientUser, myInfo,signIn, signOut, toggleActive, verifyAgent } from "../controller/authController.js";
import { checkAuthentication, requireAdmin, requireAdminOrStaff } from "../middleware/checkAuthentication.js";
import { uploadUserFiles } from "../middleware/userUpload.js";

const authRouter = Router();

// authRouter.post('/signup', signUp);
authRouter.post("/signin", signIn);

authRouter.post("/create-agent",checkAuthentication,requireAdmin,uploadUserFiles.any(),createAgentAdminStaff);
authRouter.post("/create-user",uploadUserFiles.any(),createClientUser);
authRouter.post("/verify-agent",checkAuthentication,requireAdmin,verifyAgent);
authRouter.post("/toggle-active",checkAuthentication,requireAdmin,toggleActive);

authRouter.post("/signout",signOut);
authRouter.get("/my-info",myInfo);




export default authRouter;