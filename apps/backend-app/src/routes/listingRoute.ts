import { Router } from "express";
import {
  checkAuthentication,
  requireAdmin,
  requireAdminOrStaff,
} from "../middleware/checkAuthentication.js";
import {
  addProperty,
  checkFavourite,
  createCategory,
  featureListing,
  fetchUserFavourites,
  getAllProperties,
  getUserListings,
  toggleFavourite,
  updateProperty,
  uploadCategoryImageFile,
  verifyListing,
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
listingRouter.put("/edit-property/:id", checkAuthentication, uploadUserFiles.any(), updateProperty);

listingRouter.get("/my-listings", checkAuthentication, getUserListings);
listingRouter.get("/my-favourites",checkAuthentication,fetchUserFavourites);
listingRouter.get("/get-all",checkAuthentication,requireAdmin,getAllProperties);

listingRouter.post("/mark-verified",checkAuthentication,requireAdmin,verifyListing);
listingRouter.post("/mark-featured",checkAuthentication,requireAdmin,featureListing);
listingRouter.post("/toggle-favourite", checkAuthentication, toggleFavourite);
listingRouter.post("/check-favourite", checkFavourite)


export default listingRouter;
