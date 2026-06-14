
import { Router } from "express";
import { checkAuthentication, requireAdminOrStaff } from "../middleware/checkAuthentication.js";
import { getNotification, markAllRead, markRead } from "../controller/notificationController.js";

const notificationRouter = Router();

notificationRouter.get("/", checkAuthentication, requireAdminOrStaff, getNotification);

notificationRouter.put("/mark-all-read", checkAuthentication,markAllRead);
notificationRouter.put("/mark-read/:id", checkAuthentication,markRead);

export default notificationRouter;