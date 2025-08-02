import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { ApiError } from "./errors.util.js";

export const websocketAuth = (token) => {
    if (!token) {
        throw new ApiError(401, 'Authentication token is required');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired token');
    }
}; 