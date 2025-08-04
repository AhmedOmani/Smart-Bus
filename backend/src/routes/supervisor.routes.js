import express from "express";
import { authenticationMiddleware, supervisorMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../utils/validation.util.js";
import { homeLocationSchema } from "../utils/validation.util.js";
import supervisorController from "../controllers/supervisor.controller.js";

const supervisorRoutes = express.Router();

supervisorRoutes.use(authenticationMiddleware);

supervisorRoutes.get("/my-bus", supervisorController.getBus);

// New routes for enhanced features
supervisorRoutes.put("/home-location", validateRequest(homeLocationSchema), supervisorController.updateHomeLocation);
supervisorRoutes.get("/profile", supervisorController.getProfile);

export default supervisorRoutes; 