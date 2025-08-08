import permissionRepository from "../repositories/permission.repository.js";
import studentRepository from "../repositories/student.repository.js";
import busRepository from "../repositories/bus.repository.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { successResponse } from "../utils/response.util.js";

const requestPermission = asyncHandler(async (req, res) => {
    const { studentId, date, type, reason } = req.validatedBody.body;
    const parentId = req.user.id;

    const student = await studentRepository.findStudentByParentId(studentId, parentId);
    if (!student) throw new ApiError("Student not found or not authorized to the parent", 404);

    const permission = await permissionRepository.createPermission({
        studentId,
        date: new Date(date),
        type,
        reason
    });

    return successResponse(res, "Permission requested successfully", permission);
});

const getPermissionsByStudent = asyncHandler(async (req, res) => {
    const { studentId } = req.validatedData.params;
    const parentId = req.user.id;
  
    const student = await studentRepository.findStudentByParentId(studentId, parentId);
    if (!student) throw new ApiError("Student not found", 404);
  
    const list = await permissionRepository.getPermissionsByStudent(studentId);
    return successResponse(res, list, "Permissions fetched successfully", 200);
});

const getPendingPermissions = asyncHandler(async (req, res) => {
    const supervisorId = req.user.id;
    const pending = await permissionRepository.getPendingPermissionsForSupervisor(supervisorId);
    return successResponse(res, pending, "Pending permissions fetched successfully", 200);
});

const updatePermissionStatus = asyncHandler(async (req, res) => {
    const { permissionId } = req.validatedData.params;
    const { status, notes } = req.validatedData.body;
    const supervisorId = req.user.id;
  
    const supervisorBus = await busRepository.findBusBySupervisorId(supervisorId);
    if (!supervisorBus) throw new ApiError("Bus not found for this supervisor", 404);
  
    // authorize by ensuring the permission’s student belongs to this bus
    const perm = await permissionRepository.getPermissionById(permissionId);
    if (!perm) throw new ApiError("Permission not found", 404);
    
    const studentBus = await client.student.findUnique({ where: { id: perm.studentId }, select: { busId: true } });
    if (!studentBus || studentBus.busId !== supervisorBus.id) throw new ApiError("Not authorized to update this permission", 403);
  
    const updatedPermission = await permissionRepository.updatePermissionStatus(permissionId, supervisorId, status, notes);
    return successResponse(res, updatedPermission, "Permission status updated successfully", 200);
});

const getPermissionById = asyncHandler(async (req, res) => {
    const { permissionId } = req.validatedData.params;
    const userId = req.user.id;
    const role = req.user.role;
  
    const perm = await permissionRepository.getPermissionById(permissionId);
    if (!perm) throw new ApiError("Permission not found", 404);
  
    if (role === "PARENT") {
        const student = await studentRepository.findStudentByParentId(perm.studentId, userId);
        if (!student) throw new ApiError("Not authorized to view this permission", 403);
    } else if (role === "SUPERVISOR") {
        //Check if the permission belongs to the supervisor's bus
        const bus = await busRepository.findBusBySupervisorId(userId);
        if (!bus) throw new ApiError("Bus not found for this supervisor", 404);
      
        const studentBus = await client.student.findUnique({ where: { id: perm.studentId }, select: { busId: true } });
        if (!studentBus || studentBus.busId !== bus.id) throw new ApiError("Not authorized to view this permission", 403);
    }

    return successResponse(res, perm, "Permission retrieved successfully", 200);
});

export default {
    requestPermission,
    getPermissionsByStudent,
    getPendingPermissions,
    updatePermissionStatus,
    getPermissionById
}