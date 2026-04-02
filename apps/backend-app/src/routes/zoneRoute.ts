import { Router } from "express";
import { createZoneController } from "../controller/zoneController.js";
import { checkAuthentication, requireAdmin } from "../middleware/checkAuthentication.js";

const zoneRouter = Router();

zoneRouter.post("/create",checkAuthentication,requireAdmin,createZoneController);

export default zoneRouter;