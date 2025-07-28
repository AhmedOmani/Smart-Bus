import{ client } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateUsername , generatePassword } from "../utils/admin.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { successResponse } from "../utils/response.util.js";

const getAdminDashboard = asyncHandler(async (req, res) => {
    const [users , students , activeBuses ] = await Promise.all([
        client.user.count(),
        client.student.count(),
        client.bus.count({ where: { status: "ACTIVE" }})
    ]);

    return successResponse(res, { totalUsers: users, totalStudents: students, activeBuses: activeBuses }, "Dashboard data fetched successfully");
});

const getUsers = asyncHandler(async (req, res) => {
    const { role, status, search } = req.validatedData;

    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
        const sanitizedSearch = search.trim().replace(/[%_]/g, '\\$&'); // Escape SQL wildcards
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

export default {
    getAdminDashboard,
    getUsers,
    createUser
};