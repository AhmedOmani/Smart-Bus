import absenceRepository from "../repositories/absence.repository.js";
import studentRepository from "../repositories/student.repository.js";
import busRepository from "../repositories/bus.repository.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {successResponse } from "../utils/response.util.js";
import { ApiError } from "../utils/error.util.js";

// Parent reports absence for their child
const reportAbsence = asyncHandler(async (req , res) => {
    const {studentId , startDate , endDate , reason , type } = req.validated.body;
    const parentId = req.user.id;

    const student = await studentRepository.findStudentByParentId(studentId , parentId);
    if (!student) {
        throw new ApiError("Student not found", 404);
    }

    const absence = await absenceRepository.createAbsence({
        studentId: studentId,
        reportedBy: parentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        type
    });

    return successResponse(res , "Absence reported successfully" , absence);
});

//Get absence for a specific student (parent can view their children's absences)
const getStudentAbsences = asyncHandler(async (req , res) => {
    const { studentId } = req.validatedData.params;
    const parentId = req.user.id;
    
    const student = await studentRepository.findStudentByParentId(studentId , parentId); 
    if (!student) {
        throw new ApiError("Student not found", 404);
    }

    const absences = await absenceRepository.getAbsencesByStudent(studentId);
    return successResponse(res , "Absences fetched successfully" , absences , 200);
});

//Get pending absences for supervisor (supervisor can view pending absences for their students)
const getPendingAbsences = asyncHandler(async (req , res) => {
    const supervisorId = req.user.id;
    const pendingAbsences = await absenceRepository.getPendingAbsences(supervisorId);
    return successResponse(res , "Pending absences fetched successfully" , pendingAbsences , 200);
});

const updateAbsenceStatus = asyncHandler(async (req , res) => {
    const { absenceId } = req.validatedData.params;
    const { status , notes } = req.validatedData.body ;
    const supervisorId = req.user.id;

    const absence = await absenceRepository.getAbsenceById(absenceId);
    if (!absence) {
        throw new ApiError("Absence not found", 404);
    }

    const bus = await busRepository.findBusOfSupervisorId(absence.student.busId , supervisorId);
    if (!bus) {
        throw new ApiError("Bus not found for this supervisor", 404);
    }

    const updatedAbsence = await absenceRepository.updateAbsenceStatus(absenceId , supervisorId , status , notes);
    return successResponse(res , "Absence status updated successfully" , updatedAbsence , 200);
});

//Get absence by if (for detailed view)
const getAbsenceById = asyncHandler(async (req , res) => {
    const { absenceId } = req.params;
    const userId = req.user.id ;
    const userRole = req.user.role;
    
    const absence = await absenceRepository.getAbsenceById(absenceId);
    if (!absence) {
        throw new ApiError(404, "Absence not found"); 
    }

    //Check authority for different users.
    if (userRole === "PARENT") {
        if (absence.student.parentId !== userId) {
            throw new ApiError(403 , "Not authorized to view this absence")
        }
    } else if (userRole === "SUPERVISOR") {
        const bus =  busRepository.findBusOfSupervisorId(absence.student.busId , supervisorId);
        if (!bus) { throw new ApiError(403, "Not authorized to view this absence"); }
    }

    return successResponse(res, 200, "Absence retrieved successfully", absence);
});

const deleteAbsence = asyncHandler(async (req , res) => {
    const { absentId } = req.params.id ;
    const deleteAbsence = await absenceRepository.deleteAbsence(absentId);
    return successResponse(res, 200, "Absence deleted successfully", deleteAbsence)
});

export default {
    reportAbsence,
    getStudentAbsences,
    getPendingAbsences,
    updateAbsenceStatus,
    getAbsenceById,
    deleteAbsence
}