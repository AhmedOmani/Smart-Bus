import express from "express";
import authController from "../controllers/auth.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";
import { validateRequest , loginSchema , changePasswordSchema} from "../utils/validation.util.js";

const authRoutes = express.Router();

authRoutes.post("/login" , validateRequest(loginSchema) , authController.login);
authRoutes.post("/logout" , authController.logout);
authRoutes.get("/me" , authenticationMiddleware , authController.getCurrentUser);
authRoutes.post("/change-password" , authenticationMiddleware , validateRequest(changePasswordSchema) , authController.changePassword);

export default authRoutes;