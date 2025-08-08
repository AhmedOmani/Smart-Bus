import express from "express";
import absenceController from "../controllers/absence.controller.js";
import { validateRequest , reportAbsenceSchema , updateAbsenceStatusSchema , getAbsenceByIdSchema , getAbsencesByStudentSchema} from "../utils/validation.util.js";
import { authenticationMiddleware } from "../middlewares/auth.middleware.js"; 

const absenceRoutes = express.Router();

absenceRoutes.use(authenticationMiddleware);

//Parent routes - for reporting absence.
absenceRoutes.post("/report" , validateRequest(reportAbsenceSchema) , absenceController.reportAbsence);

//Supervisor routes - for managing absences.
absenceRoutes.get("/supervisor/pending" , absenceController.getPendingAbsences);
absenceRoutes.put("/:absenceId/status" , validateRequest(updateAbsenceStatusSchema) , absenceController.updateAbsenceStatus);

//GET specific absence by ID.
absenceRoutes.get("/:absenceId" , validateRequest(getAbsenceByIdSchema) , absenceController.getAbsenceById);

//GET absebces by student ID.
absenceRoutes.get("/student/:studentId" , validateRequest(getAbsencesByStudentSchema) , absenceController.getAbsencesByStudent);

export default absenceRoutes;