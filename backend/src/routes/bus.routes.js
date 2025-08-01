import express from "express";
import busController from "../controllers/bus.controller.js";
import { authenticationMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest, saveLocationSchema } from "../utils/validation.util.js";

const busRoutes = express.Router();

busRoutes.use(authenticationMiddleware);

busRoutes.post("/location", validateRequest(saveLocationSchema), busController.saveLocation);

export default busRoutes; 