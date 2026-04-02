import { Router } from "express";
import {
  checkAuthentication,
  requireAdmin,
  requireAdminOrStaff,
} from "../middleware/checkAuthentication.js";
import {
  addProperty,
  createCategory,
  uploadCategoryImageFile,
} from "../controller/listingController.js";
import { uploadUserFiles } from "../middleware/userUpload.js";
import { addDistrictController, addMunicipalityController, addWardController } from "../controller/locationController.js";

const listingRouter = Router();

listingRouter.post(
  "/add-category",
  checkAuthentication,
  requireAdmin,
  uploadUserFiles.single("image"),
  createCategory,
);
listingRouter.post(
  "/add-property",
  checkAuthentication,
  uploadUserFiles.any(),
  addProperty,
);

listingRouter.post("/add-district", checkAuthentication, requireAdminOrStaff, addDistrictController);
listingRouter.post("/add-municipality", checkAuthentication, requireAdminOrStaff, addMunicipalityController);
listingRouter.post("/add-ward", checkAuthentication, requireAdminOrStaff, addWardController);

export default listingRouter;
