
import { Router } from "express";
import { checkAuthentication, requireAdmin } from "../middleware/checkAuthentication.js";
import {  createCategory, uploadCategoryImageFile } from "../controller/listingController.js";
import { uploadUserFiles } from "../middleware/userUpload.js";

const listingRouter = Router();

listingRouter.post("/add-category", checkAuthentication,requireAdmin,uploadUserFiles.single("image"),createCategory);

export default listingRouter;