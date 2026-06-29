import { Router } from "express";
import { assignZoneToAgentController, createZoneController, deleteZoneController, getMyzones, getZoneByIdController, getZonesController } from "../controller/zoneController.js";
import { checkAuthentication, requireAdmin, requireAdminOrStaff } from "../middleware/checkAuthentication.js";

const zoneRouter = Router();

zoneRouter.post("/create",checkAuthentication,requireAdmin,createZoneController);
zoneRouter.post("/assign-zone",checkAuthentication,requireAdmin,assignZoneToAgentController);

zoneRouter.get("/get-all",checkAuthentication,requireAdminOrStaff,getZonesController);
zoneRouter.get("/get-my-zone", checkAuthentication,requireAdminOrStaff, getMyzones);
zoneRouter.get("/get/:id",checkAuthentication,requireAdminOrStaff,getZoneByIdController);

zoneRouter.delete("/delete/:id",checkAuthentication,requireAdmin,deleteZoneController);
export default zoneRouter;