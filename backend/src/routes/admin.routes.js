/**
 * 
 * Admin Dashboard:
 * GET /api/admin/dashboard - System overview                              DONE
 * User Management:
 * GET /api/admin/users - List all users (with filters)                    DONE
 * POST /api/admin/users - Create new user                                 DONE
 * PUT /api/admin/users/:id - Update user
 * DELETE /api/admin/users/:id - Delete user
 * Student Management:
 * GET /api/admin/students - List all students
 * POST /api/admin/students - Create new student
 * Bus Management:
 * GET /api/admin/buses - List all buses
 * POST /api/admin/buses - Create new bus
 * PUT /api/admin/buses/:id/supervisor - Assign supervisor to bus
 */

import express from "express";
import adminController from "../controllers/admin.controller.js";
import { authenticationMiddleware , adminMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest , userQuerySchema , createUserSchema , updateUserSchema } from "../utils/validation.util.js";

const adminRoutes = express.Router();

adminRoutes.use(authenticationMiddleware , adminMiddleware);

// Admin Dashboard
adminRoutes.get("/dashboard" , adminController.getAdminDashboard);

// User Management
adminRoutes.get("/users" , validateRequest(userQuerySchema)  , adminController.getUsers);
adminRoutes.post("/users" , validateRequest(createUserSchema) , adminController.createUser);
adminRoutes.put("/users/:id", validateRequest(updateUserSchema), adminController.updateUser);
adminRoutes.delete("/users/:id", adminController.deleteUser);
export default adminRoutes;