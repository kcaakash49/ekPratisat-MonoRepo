
import { Router } from "express";
import { checkAuthentication } from "../middleware/checkAuthentication.js";
import { addCategory, uploadCategoryImageFile } from "../controller/listingController.js";

const listingRouter = Router();

listingRouter.post("/add-category", checkAuthentication,uploadCategoryImageFile, addCategory);

export default listingRouter;