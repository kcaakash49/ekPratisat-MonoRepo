
import { Router } from "express";
import { addLead } from "../controller/leadController.js";
import { checkAuthentication, requireAdminOrStaff } from "../middleware/checkAuthentication.js";
import { uploadUserFiles } from "../middleware/userUpload.js";

const leadRouter = Router();

leadRouter.post("/add",checkAuthentication,requireAdminOrStaff,uploadUserFiles.single("image"), addLead);

export default leadRouter;