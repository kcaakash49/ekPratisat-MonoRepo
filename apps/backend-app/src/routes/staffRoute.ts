
import { Router } from "express";

import { checkAuthentication, requireAdmin } from "../middleware/checkAuthentication.js";
import { getStaff } from "../controller/staffController.js";

const staffRouter = Router();

staffRouter.get("/get-all", checkAuthentication, requireAdmin, getStaff);

export default staffRouter;