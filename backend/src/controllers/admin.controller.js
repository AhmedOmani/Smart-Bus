import { client } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateUsername, generatePassword } from "../utils/admin.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { successResponse } from "../utils/response.util.js";
import { NotFoundError } from "../utils/errors.util.js";
import userRepository from "../repositories/user.repository.js";

const getAdminDashboard = asyncHandler(async (req, res) => {
    const [users, students, activeBuses] = await Promise.all([
        client.user.count(),
        client.student.count(),
        client.bus.count({ where: { status: "ACTIVE" }})
    ]);

    return successResponse(res, { totalUsers: users, totalStudents: students, activeBuses: activeBuses }, "Dashboard data fetched successfully");
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await userRepository.findUsers();
    return successResponse(res, { users }, "Users fetched successfully" , 200);
});

const getUsersBySearch = asyncHandler(async (req, res) => {
    const { role, status, search } = req.validatedData;

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

    const users = await client.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            username: true,
            status: true,
            createdAt: true,
            students: { select: { id: true, name: true } },
            buses: { select: { id: true, name: true } }
        },
        orderBy: { name: "asc" }
    });

    return successResponse(res, { users }, "Users fetched successfully");
});

const createUser = asyncHandler(async (req, res) => {
    const { name, email, phone, role } = req.validatedData;

    const username = await generateUsername(name);
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const transaction = await client.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: { name, email, phone, role, username, password: hashedPassword }
        });

        await tx.credential.create({
            data: { userId: user.id, username, password }
        });

        return user;
    })

    return successResponse(res, {
        id: transaction.id,
        name: transaction.name,
        email: transaction.email,
        role: transaction.role,
        username,
        password
    }, "User created successfully", 201);
});

const updateUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updateData = req.validatedData;

    if (Object.keys(updateData).length === 0) {
        return successResponse(res, null, "No update data provided.");
    }

    const user = await userRepository.findUserById(id);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    const updatedUser = await client.user.update({
        where: { id },
        data: updateData
    });

    return successResponse(res, { user: updatedUser }, "User updated successfully");
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await client.user.findUnique({ where: { id } });
    if (!user) {
        throw new NotFoundError("User not found");
    }

    await client.user.delete({
        where: { id }
    });

    return successResponse(res, null, "User deleted successfully", 204);
});

export default {
    getAdminDashboard,
    getUsers,
    getUsersBySearch,
    createUser,
    updateUser,
    deleteUser,
};