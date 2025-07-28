import { asyncHandler } from "../utils/asyncHandler.util.js";
import { successResponse } from "../utils/response.util.js";
import { client } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticationError , NotFoundError } from "../utils/errors.util.js";
import { JWT_SECRET } from "../config/env.js";

const login = asyncHandler(async (req, res) => {
    const {username , password} = req.validatedData;

    const existingUser = await client.user.findUnique({
        where: { username }
    }); 

    if (!existingUser || existingUser.status !== "ACTIVE") {
        throw new AuthenticationError("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
        throw new AuthenticationError("Invalid username or password");
    }

    await client.user.update({
        where: {id: existingUser.id},
        data: {lastLoginAt: new Date()}
    })

    const token = jwt.sign({userId: existingUser.id, role: existingUser.role}, JWT_SECRET,  {expiresIn: "12h"});

    return successResponse(res, {
        token,
        user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            username: existingUser.username
        }
    }, "Login successful");
});

const logout = asyncHandler(async(req , res) => {
        
    const token = req.headers["authorization"]?.split(" ")[1];
    
    if (!token) {
        throw new AuthenticationError("Token is required");
    }

    await client.$transaction(async (tx) => { 
        
        await tx.blacklistedToken.create({
            data: {
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });

        if (req.user?.id) {
            await tx.user.update({
                where: {id: req.user.id} ,
                data: { lastLogoutAt: new Date()}
            });
        }
    });

    return successResponse(res, null, "Logged out successfully");
});

const getCurrentUser = asyncHandler(async (req , res) => {
    const user = await client.user.findUnique({
        where: {id: req.user.id},
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            username: true,
            status: true,
            createdAt: true
        }
    });
    return successResponse(res, {user} , "User fetched sucessfully");
});

const changePassword = asyncHandler(async (req , res) => {
    const {currentPassword , newPassword} = req.validatedData;

    const user = await client.user.findUnique({
        where: {id: req.user.id}
    });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        throw new AuthenticationError("Invalid current password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await client.user.update({
        where: {id: req.user.id},
        data: {password: hashedNewPassword}
    });

    return successResponse(res, null, "Password changed successfully");
});

export default {
    login,
    logout,
    getCurrentUser,
    changePassword
}