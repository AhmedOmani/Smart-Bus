/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Dashboard data fetched successfully"
 *         data:
 *           type: object
 *           properties:
 *             totalUsers:
 *               type: number
 *               description: Total number of users in the system
 *               example: 150
 *             totalStudents:
 *               type: number
 *               description: Total number of students in the system
 *               example: 350
 *             activeBuses:
 *               type: number
 *               description: Number of active buses
 *               example: 14
 *     
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         role:
 *           type: string
 *           enum: [ADMIN, PARENT, SUPERVISOR]
 *           example: "PARENT"
 *         username:
 *           type: string
 *           example: "johndoe"
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           example: "ACTIVE"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         students:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *         buses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               name:
 *                 type: string
 *                 example: "Bus 1"
 *     
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           pattern: "^[a-zA-Z\\s]+$"
 *           description: User's full name (letters and spaces only)
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 100
 *           description: User's email address
 *           example: "john@example.com"
 *         phone:
 *           type: string
 *           pattern: "^[0-9+\\-\\s()]+$"
 *           minLength: 10
 *           maxLength: 20
 *           description: User's phone number
 *           example: "+1234567890"
 *         role:
 *           type: string
 *           enum: [ADMIN, PARENT, SUPERVISOR]
 *           description: User's role in the system
 *           example: "PARENT"
 *     
 *     CreateUserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "User created successfully"
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "123e4567-e89b-12d3-a456-426614174000"
 *             name:
 *               type: string
 *               example: "John Doe"
 *             email:
 *               type: string
 *               format: email
 *               example: "john@example.com"
 *             role:
 *               type: string
 *               enum: [ADMIN, PARENT, SUPERVISOR]
 *               example: "PARENT"
 *             username:
 *               type: string
 *               description: Auto-generated username
 *               example: "johndoe"
 *             password:
 *               type: string
 *               description: Auto-generated password (only shown once)
 *               example: "P@ssw0rd123"
 *     
 *     UsersListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Users fetched successfully"
 *         data:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: "VALIDATION_ERROR"
 *             message:
 *               type: string
 *               example: "Validation failed"
 *             details:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   field:
 *                     type: string
 *                     example: "email"
 *                   message:
 *                     type: string
 *                     example: "Invalid email format"
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints for system management
 */

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard overview
 *     description: Retrieve system statistics including total users, students, and active buses
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users with filters
 *     description: Retrieve a list of all users with optional filtering by role, status, and search term
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, PARENT, SUPERVISOR]
 *         description: Filter users by role
 *         example: "PARENT"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter users by status
 *         example: "ACTIVE"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *         description: Search users by name, email, or username (case-insensitive)
 *         example: "john"
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       400:
 *         description: Validation error in query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/admin/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with auto-generated username and password. The generated credentials are returned in the response.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       400:
 *         description: Validation error in request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict - User with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */