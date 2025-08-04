import express from "express";
import { authenticationMiddleware, parentMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../utils/validation.util.js";
import { homeLocationSchema, fcmTokenSchema } from "../utils/validation.util.js";
import parentController from "../controllers/parent.controller.js";

const parentRoutes = express.Router();

parentRoutes.use(authenticationMiddleware, parentMiddleware);

parentRoutes.get("/dashboard", parentController.getDashboard);
parentRoutes.get("/students", parentController.getStudents);
parentRoutes.get("/my-bus", parentController.getBus);

// New routes for enhanced features
parentRoutes.put("/home-location", validateRequest(homeLocationSchema), parentController.updateHomeLocation);
parentRoutes.put("/fcm-token", validateRequest(fcmTokenSchema), parentController.updateFcmToken);
parentRoutes.get("/profile", parentController.getProfile);

export default parentRoutes;