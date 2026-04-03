import { Router } from "express";
import { createZoneController, deleteZoneController, getZonesController } from "../controller/zoneController.js";
import { checkAuthentication, requireAdmin } from "../middleware/checkAuthentication.js";

const zoneRouter = Router();

zoneRouter.post("/create",checkAuthentication,requireAdmin,createZoneController);
zoneRouter.get("/get-all",checkAuthentication,requireAdmin,getZonesController);
zoneRouter.delete("/delete/:id",checkAuthentication,requireAdmin,deleteZoneController); 

export default zoneRouter;