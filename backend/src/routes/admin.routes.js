import express from "express";
import adminController from "../controllers/admin.controller.js";
import { authenticationMiddleware , adminMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest,  createUserSchema, updateUserSchema ,createStudentSchema ,updateStudentSchema , userQuerySchema , createBusSchema , updateBusSchema, adminAbsencesQuerySchema, adminPermissionsQuerySchema} from "../utils/validation.util.js";

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

//Bus Management
adminRoutes.get("/buses" , adminController.getBuses);
adminRoutes.post("/buses" , validateRequest(createBusSchema) , adminController.createBus);
adminRoutes.put("/buses/:id" , validateRequest(updateBusSchema) , adminController.updateBus);
adminRoutes.delete("/buses/:id" , adminController.deleteBus);

//Supervisor Management
adminRoutes.get("/supervisors" , adminController.getSupervisors);

// Admin Absences & Permissions
adminRoutes.get("/absences", validateRequest(adminAbsencesQuerySchema), adminController.getAllAbsences);
adminRoutes.get("/permissions", validateRequest(adminPermissionsQuerySchema), adminController.getAllPermissions);

// Credentials Management
adminRoutes.get("/credentials", adminController.getAllCredentials);

export default adminRoutes;