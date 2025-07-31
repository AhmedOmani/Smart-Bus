import { client } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateUsername, generatePassword } from "../utils/admin.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { successResponse } from "../utils/response.util.js";
import { ApiError, NotFoundError } from "../utils/errors.util.js";
import userRepository from "../repositories/user.repository.js";
import studentRepository from "../repositories/student.repository.js";

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
    console.log(req.query);
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
    const { nationalId , name, email, phone, role  } = req.validatedData;

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
    const studentData = req.validatedData;

    // Verify parent exists
    const parent = await client.parent.findUnique({ where: { id: studentData.parentId } });
    if (!parent) {
        throw new ApiError("The selected parent does not exist.", 400, "VALIDATION_ERROR");
    }

    const newStudent = await studentRepository.createStudent(studentData);
    return successResponse(res, { student: newStudent }, "Student created successfully", 201);
});

const updateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const studentData = req.validatedData;

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
};