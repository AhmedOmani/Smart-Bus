import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { client } from "../config/db.js";
import { AuthenticationError, AuthorizationError } from "../utils/errors.util.js";

export const authenticationMiddleware = async (req , res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            throw new AuthenticationError("User not authenticated");
        }
        
        const blackListedToken = await client.blackListedToken.findUnique({
            where: {token}
        });

        if (blackListedToken) {
            throw new AuthenticationError("Token has been invalidated");
        }

        const decode = jwt.verify(token, JWT_SECRET);
        const user = await client.user.findUnique({
            where: {id: decode.userId}
        });

        if (!user || user.status !== "ACTIVE") {
            throw new AuthenticationError("Invalid or inactive user");
        }

        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new AuthenticationError("Invalid token");
        }
        if (error.name === 'TokenExpiredError') {
            throw new AuthenticationError("Token expired");
        }
        throw error;
    }
}

export const adminMiddleware = async (req , res , next) => {
    if (req.user.role !== "ADMIN") {
        throw new AuthorizationError("Access denied, only admin can access this resource");
    }
    next();
}

export const parentMiddleware = async (req , res , next) => {
    if (req.user.role !== "PARENT") {
        throw new AuthorizationError("Access denied, only parent can access this resource");
    }
    next();
}

export const supervisorMiddleware = async (req , res , next) => {
    if (req.user.role !== "SUPERVISOR") {
        throw new AuthorizationError("Access denied, only supervisor can access this resource");
    }
}