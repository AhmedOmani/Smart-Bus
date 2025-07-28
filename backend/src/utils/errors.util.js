export class AppError extends Error {
    constructor(message , statusCode , errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

export class AuthenticationError extends AppError {
    constructor(message) {
        super(message, 401, 'AUTHENTICATION_ERROR');
    }
}

export class AuthorizationError extends AppError {
    constructor(message) {
        super(message, 403, 'AUTHORIZATION_ERROR');
    }
}

export class NotFoundError extends AppError {
    constructor(resource) {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

export class DatabaseError extends AppError {
    constructor(message) {
        super(message, 500, 'DATABASE_ERROR');
    }
}