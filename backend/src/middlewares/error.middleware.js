import { errorResponse } from "../utils/response.util.js";
import { ApiError } from "../utils/errors.util.js";

export const globalErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Prisma errors
    if (err.code === 'P2002') {
        const message = 'Duplicate field value entered';
        error = new ApiError(message, 400, 'DUPLICATE_ERROR');
    }

    if (err.code === 'P2025') {
        const message = 'Record not found';
        error = new ApiError(message, 404, 'NOT_FOUND');
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new ApiError(message, 401, 'INVALID_TOKEN');
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new ApiError(message, 401, 'TOKEN_EXPIRED');
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ApiError(message, 400, 'VALIDATION_ERROR');
    }

    errorResponse(res, error);
};