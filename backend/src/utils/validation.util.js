import { z } from "zod";

// ========================================
// AUTHENTICATION VALIDATION
// ========================================

export const loginSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must be less than 50 characters")
        .trim(),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 100 characters")
});

export const changePasswordSchema = z.object({
    currentPassword: z.string()
        .min(8, "Current password must be at least 8 characters"),
    newPassword: z.string()
        .min(8, "New password must be at least 8 characters")
        .max(100, "New password must be less than 100 characters")
        .refine(
            (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password),
            "Password must contain at least one lowercase letter, one uppercase letter, and one number"
        )
});

// ========================================
// USER MANAGEMENT VALIDATION
// ========================================

export const createUserSchema = z.object({
    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must be less than 100 characters")
        .refine(
            (name) => /^[a-zA-Z\s]+$/.test(name),
            "Name can only contain letters and spaces"
        )
        .trim(),
    email: z.string()
        .email("Invalid email format")
        .max(100, "Email must be less than 100 characters")
        .toLowerCase()
        .trim(),
    phone: z.string()
        .refine(
            (phone) => /^[0-9+\-\s()]+$/.test(phone),
            "Invalid phone number format"
        )
        .min(10, "Phone number must be at least 10 digits")
        .max(20, "Phone number must be less than 20 digits")
        .optional(),
    role: z.enum(["ADMIN", "PARENT", "SUPERVISOR"], {
        errorMap: () => ({ message: "Role must be ADMIN, PARENT, or SUPERVISOR" })
    })
});

export const updateUserSchema = z.object({
    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must be less than 100 characters")
        .refine(
            (name) => /^[a-zA-Z\s]+$/.test(name),
            "Name can only contain letters and spaces"
        )
        .trim()
        .optional(),
    email: z.string()
        .email("Invalid email format")
        .max(100, "Email must be less than 100 characters")
        .toLowerCase()
        .trim()
        .optional(),
    phone: z.string()
        .refine(
            (phone) => /^[0-9+\-\s()]+$/.test(phone),
            "Invalid phone number format"
        )
        .min(10, "Phone number must be at least 10 digits")
        .max(20, "Phone number must be less than 20 digits")
        .optional(),
    status: z.enum(["ACTIVE", "INACTIVE"], {
        errorMap: () => ({ message: "Status must be ACTIVE or INACTIVE" })
    }).optional()
});

// ========================================
// QUERY PARAMETER VALIDATION
// ========================================

export const userQuerySchema = z.object({
    role: z.enum(["ADMIN", "PARENT", "SUPERVISOR"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    search: z.string()
        .min(1, "Search term must be at least 1 character")
        .max(50, "Search term must be less than 50 characters")
        .optional()
});

// ========================================
// STUDENT MANAGEMENT VALIDATION
// ========================================

export const createStudentSchema = z.object({
    name: z.string()
        .min(3, "Student name must be at least 3 characters")
        .max(100, "Student name must be less than 100 characters")
        .refine(
            (name) => /^[a-zA-Z\s]+$/.test(name),
            "Student name can only contain letters and spaces"
        )
        .trim(),
    parentId: z.string()
        .uuid("Invalid parent ID format"),
    busId: z.string()
        .uuid("Invalid bus ID format")
});

// ========================================
// BUS MANAGEMENT VALIDATION
// ========================================

export const createBusSchema = z.object({
    name: z.string()
        .min(3, "Bus name must be at least 3 characters")
        .max(50, "Bus name must be less than 50 characters")
        .trim(),
    supervisorId: z.string()
        .uuid("Invalid supervisor ID format")
        .optional(),
    capacity: z.number()
        .int("Capacity must be a whole number")
        .min(1, "Capacity must be at least 1")
        .max(100, "Capacity must be less than 100")
        .optional()
});

export const assignSupervisorSchema = z.object({
    supervisorId: z.string()
        .uuid("Invalid supervisor ID format")
});

// ========================================
// VALIDATION MIDDLEWARE
// ========================================

export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            let data;
            
            // Validate based on request method
            if (req.method === 'GET') {
                data = schema.parse(req.query);
            } else {
                data = schema.parse(req.body);
            }
            
            // Attach validated data to request
            req.validatedData = data;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const validationErrors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: validationErrors
                    }
                });
            }
            next(error);
        }
    };
};