import { z } from "zod";

// AUTHENTICATION VALIDATION

export const loginSchema = z.object({
    body: z.object({
        username: z.string()
            .min(3, "Username must be at least 3 characters")
            .max(50, "Username must be less than 50 characters")
            .trim(),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password must be less than 100 characters")
    })
});

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string()
            .min(8, "Current password must be at least 8 characters"),
        newPassword: z.string()
            .min(8, "New password must be at least 8 characters")
            .max(100, "New password must be less than 100 characters")
            .refine(
                (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password),
                "Password must contain at least one lowercase letter, one uppercase letter, and one number"
            )
    })
});


// USER MANAGEMENT VALIDATION
const nameValidation = z.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters")
    .refine(
        (name) => /^[a-zA-Z\s\u0600-\u06FF]+$/.test(name),
        "Name can only contain letters and spaces from supported languages"
    )
    .trim();

export const createUserSchema = z.object({
    body: z.object({
        nationalId: z.string().min(8, "National ID is too short").max(12, "National ID is too long"),
        name: nameValidation,
        email: z.string().email("Invalid email format").toLowerCase().trim(),
        phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{8,15}$/, "Invalid phone number format").optional(),
        role: z.enum(['ADMIN', 'SUPERVISOR', 'PARENT']),
    })
});

export const updateUserSchema = z.object({
    body: z.object({
        nationalId: z.string().min(8).max(12).optional(),
        name: nameValidation.optional(),
        email: z.string().email().toLowerCase().trim().optional(),
        phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{8,15}$/, "Invalid phone number").optional(),
        role: z.enum(['ADMIN', 'SUPERVISOR', 'PARENT']).optional(),
        status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    }).partial(),
    params: z.object({
        id: z.string().uuid(),
    }),
});


// QUERY PARAMETER VALIDATION
export const userQuerySchema = z.object({
    query: z.object({
        role: z.enum(["ADMIN", "PARENT", "SUPERVISOR"]).optional(),
        status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
        search: z.string()
            .min(1, "Search term must be at least 1 character")
            .max(50, "Search term must be less than 50 characters")
            .optional()
    })
});


// STUDENT MANAGEMENT VALIDATION
export const createStudentSchema = z.object({
    body: z.object({
        name: nameValidation,
        nationalId: z.string().min(1, 'National ID is required'),
        grade: z.string().min(1, 'Grade is required'),
        parentId: z.string().uuid('Invalid parent ID'),
        busId: z.string().uuid("Invalid bus ID").optional().nullable(),
        homeAddress: z.string().optional().nullable(),
        homeLatitude: z.number().optional().nullable(),
        homeLongitude: z.number().optional().nullable(),
    })
});

export const updateStudentSchema = z.object({
    body: z.object({
        name: nameValidation.optional(),
        nationalId: z.string().min(1, 'National ID is required').optional(),
        grade: z.string().min(1, 'Grade is required').optional(),
        parentId: z.string().uuid('Invalid parent ID').optional(),
        busId: z.string().uuid("Invalid bus ID").optional().nullable(),
        homeAddress: z.string().optional().nullable(),
        homeLatitude: z.number().optional().nullable(),
        homeLongitude: z.number().optional().nullable(),
        status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    }).partial(),
    params: z.object({
        id: z.string().uuid(),
    }),
});

// BUS MANAGEMENT VALIDATION
export const createBusSchema = z.object({
    body: z.object({
        busNumber: z.string().min(1, 'Bus number is required'),
        licensePlate: z.string().optional().nullable(),
        capacity: z.number().int().positive('Capacity must be a positive number'),
        model: z.string().optional().nullable(),
        year: z.number().int().positive('Year must be a positive number').optional().nullable(),
        driverName: z.string().optional().nullable(),
        driverPhone: z.string().optional().nullable(),
        driverLicenseNumber: z.string().optional().nullable(),
        supervisorId: z.string().uuid("Invalid supervisor ID").optional().nullable(),
        status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).optional(),
    })
});

export const updateBusSchema = z.object({
    body: z.object({
        busNumber: z.string().min(1).optional(),
        licensePlate: z.string().optional().nullable(),
        capacity: z.number().int().positive().optional(),
        model: z.string().optional().nullable(),
        year: z.number().int().positive().optional().nullable(),
        driverName: z.string().optional().nullable(),
        driverPhone: z.string().optional().nullable(),
        driverLicenseNumber: z.string().optional().nullable(),
        supervisorId: z.string().uuid("Invalid supervisor ID").optional(),
        status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).optional(),
    }).partial(),
    params: z.object({
        id: z.string().uuid(),
    }),
});

// LOCATION TRACKING VALIDATION
export const saveLocationSchema = z.object({
    body: z.object({
        latitude: z.number().min(-90, "Invalid latitude").max(90, "Invalid latitude"),
        longitude: z.number().min(-180, "Invalid longitude").max(180, "Invalid longitude"),
    })
});

// ========================================
// VALIDATION MIDDLEWARE
// ========================================

export const validateRequest = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!result.success) {
            const validationErrors = result.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Validation failed, please check your input.",
                    details: validationErrors
                }
            });
        }
     
        req.validatedData = result.data; // Corrected: assign the whole data object
        next();
    } catch (error) {
        next(error);
    }
};

    