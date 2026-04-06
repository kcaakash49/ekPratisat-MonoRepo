import { Router } from "express";
import { assignZoneToAgentController, createZoneController, deleteZoneController, getZoneByIdController, getZonesController } from "../controller/zoneController.js";
import { checkAuthentication, requireAdmin, requireAdminOrStaff } from "../middleware/checkAuthentication.js";

const zoneRouter = Router();

zoneRouter.post("/create",checkAuthentication,requireAdmin,createZoneController);
zoneRouter.get("/get-all",checkAuthentication,requireAdminOrStaff,getZonesController);
zoneRouter.delete("/delete/:id",checkAuthentication,requireAdmin,deleteZoneController);
zoneRouter.get("/get/:id",checkAuthentication,requireAdminOrStaff,getZoneByIdController);
zoneRouter.post("/assign-zone",checkAuthentication,requireAdmin,assignZoneToAgentController);

export default zoneRouter;