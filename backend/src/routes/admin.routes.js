import express from "express";
import adminController from "../controllers/admin.controller.js";
import { authenticationMiddleware , adminMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest,  createUserSchema, updateUserSchema ,createStudentSchema ,updateStudentSchema , userQuerySchema} from "../utils/validation.util.js";

const adminRoutes = express.Router();

adminRoutes.use(authenticationMiddleware , adminMiddleware);

// Admin Dashboard
adminRoutes.get("/dashboard" , adminController.getAdminDashboard);

// User Management (supervisor and parent)
adminRoutes.get("/users" , adminController.getUsers);
adminRoutes.get("/users/search" , validateRequest(userQuerySchema) , adminController.getUsersBySearch);
adminRoutes.post("/users" , validateRequest(createUserSchema) , adminController.createUser);
adminRoutes.put("/users/:id", validateRequest(updateUserSchema), adminController.updateUser);
adminRoutes.delete("/users/:id", adminController.deleteUser);

//Student Management
adminRoutes.get("/students" , adminController.getStudents);
adminRoutes.post("/students" , validateRequest(createStudentSchema) , adminController.createStudent);
adminRoutes.put("/students/:id" , validateRequest(updateStudentSchema) , adminController.updateStudent);
adminRoutes.delete("/students/:id" , adminController.deleteStudent);

export default adminRoutes;