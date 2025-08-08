import express from "express";
import permissionController from "../controllers/permission.controller.js";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { requestPermissionSchema, updatePermissionStatusSchema, getPermissionByIdSchema, getPermissionsByStudentSchema } from "../utils/validation.util.js";

const permissionRoutes = express.Router();

permissionRoutes.use(authenticationMiddleware);

//Parent
permissionRoutes.post("/", validateRequest(requestPermissionSchema), permissionController.requestPermission);
permissionRoutes.get("/student/:studentId", validateRequest(getPermissionsByStudentSchema), permissionController.getPermissionsByStudent);

//Supervisor
permissionRoutes.get("/pending", permissionController.getPendingPermissions);
permissionRoutes.put("/:permissionId", validateRequest(updatePermissionStatusSchema), permissionController.updatePermissionStatus);

//Shared
permissionRoutes.get("/:permissionId", validateRequest(getPermissionByIdSchema), permissionController.getPermissionById);

export default permissionRoutes;