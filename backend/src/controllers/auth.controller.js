import { asyncHandler } from "../utils/asyncHandler.util.js";
import { successResponse } from "../utils/response.util.js";
import bcrypt from "bcrypt";        
import jwt from "jsonwebtoken";
import { AuthenticationError , NotFoundError } from "../utils/errors.util.js";
import { JWT_SECRET } from "../config/env.js";
import userRepository from "../repositories/user.repository.js";

const login = asyncHandler(async (req, res) => {
    console.log(req.validatedData.body);
    console.log("--------------------------------");
    const { username, password } = req.validatedData.body;    

    const existingUser = await userRepository.findUserByUsername(username);
    if (!existingUser || existingUser.status !== "ACTIVE") {
        throw new AuthenticationError("User not found");
    }
    console.log(existingUser);
    console.log("--------------------------------");

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
        throw new AuthenticationError("Invalid username or password");
    }

    console.log("JWT_SECRET" , JWT_SECRET);

    await userRepository.updateUserLogin(existingUser.id, {lastLoginAt: new Date()});

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
    

    await userRepository.updateUserLogout(req.user.id , token); 

    return successResponse(res, null, "Logged out successfully");
});

const getCurrentUser = asyncHandler(async (req , res) => {
    const user = await userRepository.findUserById(req.user.id);
    return successResponse(res, {user} , "User fetched sucessfully");
});

const changePassword = asyncHandler(async (req , res) => {
    const { currentPassword, newPassword } = req.validatedData.body;

    const user = await userRepository.findUserById(req.user.id);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        throw new AuthenticationError("Invalid current password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await userRepository.updateUserPassword(req.user.id , hashedNewPassword);

    return successResponse(res, null, "Password changed successfully");
});

export default {
    login,
    logout,
    getCurrentUser,
    changePassword      
}