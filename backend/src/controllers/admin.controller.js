import { client } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateUsername, generatePassword } from "../utils/admin.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { successResponse } from "../utils/response.util.js";
import { ApiError, NotFoundError } from "../utils/errors.util.js";
import userRepository from "../repositories/user.repository.js";
import studentRepository from "../repositories/student.repository.js";
import busRepository from "../repositories/bus.repository.js";
import supervisorRepository from "../repositories/supervisor.repository.js";
import absenceRepository from "../repositories/absence.repository.js";
import permissionRepository from "../repositories/permission.repository.js";

const getAdminDashboard = asyncHandler(async (req, res) => {
    const [users, students, activeBuses] = await Promise.all([
        client.user.count(),
        client.student.count(),
        client.bus.count({ where: { status: "ACTIVE" }})
    ]);

    return successResponse(res, { totalUsers: users, totalStudents: students, activeBuses: activeBuses }, "Dashboard data fetched successfully");
});

//User Management
const getUsers = asyncHandler(async (req, res) => {
    const users = await userRepository.findUsers();
    return successResponse(res, { users }, "Users fetched successfully" , 200);
});
const getUsersBySearch = asyncHandler(async (req, res) => {
    const { role, status, search } = req.query;
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
        const sanitizedSearch = search.trim().replace(/[%_]/g, '\\$&');
        where.OR = [
            { name: { contains: sanitizedSearch, mode: "insensitive" } },
            { email: { contains: sanitizedSearch, mode: "insensitive" } },
            { username: { contains: sanitizedSearch, mode: "insensitive" } }
        ];
    }
        
    const users = await userRepository.findUserBySearch(where);
    return successResponse(res, { users }, "Users fetched successfully");
});
const createUser = asyncHandler(async (req, res) => {
    const { nationalId , name, email, phone, role  } = req.validatedData.body;

    const username = await generateUsername(name);
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser({ nationalId, name, email, phone, role, username, password, hashedPassword });

    return successResponse(res, {
        user: {
            id: user.id,
            nationalId: user.nationalId,
            name: user.name,
            email: user.email,
            role: user.role,
            username,
        },
        credentials: {
            username,
            password
        }
    }, "User created successfully", 201);
});
const updateUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updateData = req.validatedData.body;

    if (Object.keys(updateData).length === 0) {
        return successResponse(res, null, "No update data provided.");
    }

    const user = await userRepository.findUserById(id);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    const updatedUser = await userRepository.updateUser(id, updateData);

    return successResponse(res, { user: updatedUser }, "User updated successfully");
});
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await client.user.findUnique({ where: { id } });
    if (!user) {
        throw new NotFoundError("User not found");
    }

    await userRepository.deleteUser(id);

    return successResponse(res, null, "User deleted successfully", 204);
});

// Student Management
const getStudents = asyncHandler(async (req, res) => {
    const students = await studentRepository.findStudents();
    return successResponse(res, { students }, "Students fetched successfully");
});
const createStudent = asyncHandler(async (req, res) => {
    const studentData = req.validatedData.body;
    const newStudent = await studentRepository.createStudent(studentData);
    return successResponse(res, { student: newStudent }, "Student created successfully", 201);
});
const updateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const studentData = req.validatedData.body;

    const student = await studentRepository.findStudentById(id);
    if (!student) {
        throw new NotFoundError("Student not found");
    }

    const updatedStudent = await studentRepository.updateStudent(id, studentData);
    return successResponse(res, { student: updatedStudent }, "Student updated successfully");
});
const deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const student = await studentRepository.findStudentById(id);
    if (!student) {
        throw new NotFoundError("Student not found");
    }

    await studentRepository.deleteStudent(id);
    return successResponse(res, null, "Student deleted successfully", 204);
});

//Bus Management
const getBuses = asyncHandler(async (req , res) => {
    const buses = await busRepository.findBuses();
    return successResponse(res, { buses }, "Buses fetched successfully");
});
const createBus = asyncHandler(async (req , res) => {
    const busData = req.validatedData.body;
    
    // Prevent assigning a supervisor who is already assigned to another bus
    if (busData.supervisorId) {
        const existing = await busRepository.findBusBySupervisorId(busData.supervisorId);
        if (existing) {
            throw new ApiError(409, "Supervisor is already assigned to another bus");
        }
    }
    const bus = await busRepository.createBus(busData);
    return successResponse(res, { bus }, "Bus created successfully", 201);
});
const updateBus = asyncHandler(async (req , res) => {
    const { id } = req.params;
    const busData = req.validatedData.body;
    
    // If trying to assign a supervisor, ensure that supervisor is not already assigned elsewhere
    if (busData.supervisorId) {
        const existing = await busRepository.findBusBySupervisorId(busData.supervisorId);
        if (existing && existing.id !== id) {
            throw new ApiError(409, "Supervisor is already assigned to another bus");
        }
    }
    const bus = await busRepository.updateBus(id , busData);
    return successResponse(res, { bus }, "Bus updated successfully");
});
const deleteBus = asyncHandler(async (req , res) => {
    const { id } = req.params;
    const bus = await busRepository.findBusById(id);
    if (!bus) {
        throw new NotFoundError("Bus not found");
    }
    await busRepository.deleteBus(id);
    return successResponse(res, null, "Bus deleted successfully", 204);
});
const getBusesWithLocations = asyncHandler(async (req, res) => {
  const THRESHOLD_MS = 60 * 1000; // 60 seconds
  const now = Date.now();

  const buses = await busRepository.findBusesWithLocation();

  const mapped = buses.map(b => {
    const online = b.lastLocation ? (now - new Date(b.lastLocation.timestamp).getTime() <= THRESHOLD_MS) : false;
    return { ...b, online };
  });

  return successResponse(res, { buses: mapped }, "Buses with last locations fetched successfully", 200);
});

//Supervisor Management
const getSupervisors = asyncHandler(async (req , res) => {
    const supervisors = await supervisorRepository.findSupervisors();
    return successResponse(res, { supervisors }, "Supervisors fetched successfully");
});

// Admin: Absences & Permissions listing
const getAllAbsences = asyncHandler(async (req, res) => {
    const { status, type, studentId, busId, startDate, endDate } = req.validatedData.query;
    const list = await absenceRepository.findAbsencesForAdmin({ status, type, studentId, busId, startDate, endDate });
    return successResponse(res, { absences: list }, "Absences fetched successfully", 200);
});

const getAllPermissions = asyncHandler(async (req, res) => {
    const { status, type, studentId, busId, startDate, endDate } = req.validatedData.query;
    const list = await permissionRepository.findPermissionsForAdmin({ status, type, studentId, busId, startDate, endDate });
    return successResponse(res, { permissions: list }, "Permissions fetched successfully", 200);
});

// Credentials Management
const getAllCredentials = asyncHandler(async (req, res) => {
    const credentials = await userRepository.getAllCredentials();
    return successResponse(res, { credentials }, "Credentials fetched successfully", 200);
});

export default {
    getAdminDashboard,
    getUsers,
    getUsersBySearch,
    createUser,
    updateUser,
    deleteUser,
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getBuses,
    createBus,
    updateBus,
    deleteBus,
    getSupervisors,
    getAllAbsences,
    getAllPermissions,
    getAllCredentials,
    getBusesWithLocations
};