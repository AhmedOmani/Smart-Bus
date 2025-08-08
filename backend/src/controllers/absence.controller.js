import absenceRepository from "../repositories/absence.repository.js";
import studentRepository from "../repositories/student.repository.js";
import busRepository from "../repositories/bus.repository.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {successResponse } from "../utils/response.util.js";
import { ApiError } from "../utils/errors.util.js";

// Parent reports absence for their child
const reportAbsence = asyncHandler(async (req , res) => {
    const {studentId , startDate , endDate , reason , type } = req.validatedData.body;
    const parentId = req.user.id;

    const student = await studentRepository.findStudentByParentId(studentId , parentId);
    if (!student) {
        throw new ApiError("Student not found or not authorized to the parent", 404);
    }

    const absence = await absenceRepository.createAbsence({
        studentId: studentId,
        reportedBy: parentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        type
    });

    return successResponse(res, absence, "Absence reported successfully", 201);
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
    return successResponse(res , absences, "Absences fetched successfully" , 200);
});

//Get pending absences for supervisor (supervisor can view pending absences for their students)
const getPendingAbsences = asyncHandler(async (req , res) => {
    const supervisorId = req.user.id;
    const pendingAbsences = await absenceRepository.getPendingAbsencesForSupervisor(supervisorId);
    console.log(pendingAbsences);
    return successResponse(res , pendingAbsences, "Pending absences fetched successfully" , 200);
});

const updateAbsenceStatus = asyncHandler(async (req , res) => {
    const { absenceId } = req.validatedData.params;
    const { status , notes } = req.validatedData.body ;
    const supervisorId = req.user.id;

    const absence = await absenceRepository.getAbsenceById(absenceId);
    if (!absence) {
        throw new ApiError("Absence not found", 404);
    }

    const bus = await busRepository.findBusBySupervisorId(supervisorId);
    if (!bus) {
        throw new ApiError("Bus not found for this supervisor", 404);
    }

    const updatedAbsence = await absenceRepository.updateAbsenceStatus(absenceId , supervisorId , status , notes);
    return successResponse(res , updatedAbsence, "Absence status updated successfully" , 200);
});

//Get absence by if (for detailed view)
const getAbsenceById = asyncHandler(async (req , res) => {
    const { absenceId } = req.validatedData.params;
    const userId = req.user.id ;
    const userRole = req.user.role;
    
    const absence = await absenceRepository.getAbsenceById(absenceId);
    if (!absence) {
        throw new ApiError("Absence not found", 404); 
    }

    //Check authority for different users.
    if (userRole === "PARENT") {
        if (absence.student.parentId !== userId) {
            throw new ApiError("Not authorized to view this absence", 403);
        }
    } else if (userRole === "SUPERVISOR") {
        const bus =  await busRepository.findBusBySupervisorId(userId);     
        if (!bus || bus.id !== absence.student.busId) { throw new ApiError("Not authorized to view this absence", 403); }
    }

    return successResponse(res, absence, "Absence retrieved successfully", 200);
});

const getAbsencesByStudent = asyncHandler(async (req , res) => {
    const { studentId } = req.validatedData.params;
    const absences = await absenceRepository.getAbsencesByStudent(studentId);
    return successResponse(res , absences, "Absences fetched successfully" , 200);
})
const deleteAbsence = asyncHandler(async (req , res) => {
    const { absentId } = req.params.id ;
    const deleteAbsence = await absenceRepository.deleteAbsence(absentId);
    return successResponse(res, deleteAbsence, "Absence deleted successfully", 200);
});

export default {
    reportAbsence,
    getStudentAbsences,
    getPendingAbsences,
    updateAbsenceStatus,
    getAbsenceById,
    getAbsencesByStudent,
    deleteAbsence
}