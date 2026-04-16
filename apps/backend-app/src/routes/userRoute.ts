
import { Router } from "express";

import { checkAuthentication, requireAdmin } from "../middleware/checkAuthentication.js";
import { getStaff, getUsers } from "../controller/usersfController.js";

const userRouter = Router();

userRouter.get("/get-all", checkAuthentication, requireAdmin, getUsers);

export default userRouter;