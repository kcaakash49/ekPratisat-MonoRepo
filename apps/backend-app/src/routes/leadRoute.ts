
import { Router } from "express";
import { addLead, getLeadById, getLeads, updateFollowUpTime, updateLeadStatus } from "../controller/leadController.js";
import { checkAuthentication, requireAdminOrStaff } from "../middleware/checkAuthentication.js";
import { uploadUserFiles } from "../middleware/userUpload.js";

const leadRouter = Router();

leadRouter.post("/add",checkAuthentication,requireAdminOrStaff,uploadUserFiles.single("image"), addLead);

leadRouter.get("/",checkAuthentication,requireAdminOrStaff, getLeads);
leadRouter.get("/:id",checkAuthentication,requireAdminOrStaff, getLeadById);

leadRouter.put("/status/:id", checkAuthentication, requireAdminOrStaff, updateLeadStatus);
leadRouter.put("/follow-up/:id", checkAuthentication,requireAdminOrStaff,updateFollowUpTime);

export default leadRouter;