import express from "express";
import { authenticationMiddleware  , parentMiddleware} from "../middlewares/auth.middleware.js";
import parentController from "../controllers/parent.controller.js";

const parentRoutes = express.Router();

parentRoutes.use(authenticationMiddleware , parentMiddleware);

parentRoutes.get("/dashboard" , parentController.getDashboard);
parentRoutes.get("/students" , parentController.getStudents);
parentRoutes.get("/my-bus" , parentController.getBus);

export default parentRoutes;