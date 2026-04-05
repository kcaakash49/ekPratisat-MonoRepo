import { Router } from "express";
import { createZoneController, deleteZoneController, getZoneByIdController, getZonesController } from "../controller/zoneController.js";
import { checkAuthentication, requireAdmin, requireAdminOrStaff } from "../middleware/checkAuthentication.js";

const zoneRouter = Router();

zoneRouter.post("/create",checkAuthentication,requireAdmin,createZoneController);
zoneRouter.get("/get-all",checkAuthentication,requireAdminOrStaff,getZonesController);
zoneRouter.delete("/delete/:id",checkAuthentication,requireAdmin,deleteZoneController);
zoneRouter.get("/get/:id",checkAuthentication,requireAdminOrStaff,getZoneByIdController);

export default zoneRouter;