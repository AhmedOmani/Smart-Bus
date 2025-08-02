import express from "express";
import { authenticationMiddleware, supervisorMiddleware } from "../middlewares/auth.middleware.js";
import supervisorController from "../controllers/supervisor.controller.js";

const supervisorRoutes = express.Router();

supervisorRoutes.use(authenticationMiddleware);

supervisorRoutes.get("/mybus", supervisorController.getBus);

export default supervisorRoutes; 