export const successResponse = (res , data , message = "SUCCESS" , statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (res , error) => {
    const statusCode = error.statusCode || 500;
    const errorCode = error.errorCode || "INTERNAL_SERVER_ERROR";

    return res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        }
    });
}