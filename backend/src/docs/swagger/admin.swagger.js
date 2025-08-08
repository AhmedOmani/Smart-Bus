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

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   put:
 *     summary: Update a user's information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/admin/users/search:
 *   get:
 *     summary: Search users with query parameters
 *     description: Search and filter users by role, status, and search term
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter users by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, email, or username
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nationalId:
 *           type: string
 *         name:
 *           type: string
 *         grade:
 *           type: string
 *         homeAddress:
 *           type: string
 *         homeLatitude:
 *           type: number
 *         homeLongitude:
 *           type: number
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         parentId:
 *           type: string
 *           format: uuid
 *         busId:
 *           type: string
 *           format: uuid
 *         parent:
 *           $ref: '#/components/schemas/Parent'
 *         bus:
 *           $ref: '#/components/schemas/Bus'
 *     
 *     CreateStudentRequest:
 *       type: object
 *       required:
 *         - name
 *         - nationalId
 *         - grade
 *         - parentId
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *         nationalId:
 *           type: string
 *           minLength: 1
 *         grade:
 *           type: string
 *           minLength: 1
 *         parentId:
 *           type: string
 *           format: uuid
 *         busId:
 *           type: string
 *           format: uuid
 *         homeAddress:
 *           type: string
 *         homeLatitude:
 *           type: number
 *         homeLongitude:
 *           type: number
 *     
 *     Bus:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         busNumber:
 *           type: string
 *         licensePlate:
 *           type: string
 *         capacity:
 *           type: integer
 *         model:
 *           type: string
 *         year:
 *           type: integer
 *         driverName:
 *           type: string
 *         driverPhone:
 *           type: string
 *         driverLicenseNumber:
 *           type: string
 *         supervisorId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, MAINTENANCE]
 *         supervisor:
 *           $ref: '#/components/schemas/Supervisor'
 *         students:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Student'
 *     
 *     CreateBusRequest:
 *       type: object
 *       required:
 *         - busNumber
 *         - capacity
 *       properties:
 *         busNumber:
 *           type: string
 *           minLength: 1
 *         licensePlate:
 *           type: string
 *         capacity:
 *           type: integer
 *           minimum: 1
 *         model:
 *           type: string
 *         year:
 *           type: integer
 *           minimum: 1900
 *         driverName:
 *           type: string
 *         driverPhone:
 *           type: string
 *         driverLicenseNumber:
 *           type: string
 *         supervisorId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, MAINTENANCE]
 */

/**
 * @swagger
 * /api/v1/admin/students:
 *   get:
 *     summary: Get all students
 *     description: Retrieve a list of all students
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     students:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 *   
 *   post:
 *     summary: Create a new student
 *     description: Create a new student record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/admin/students/{id}:
 *   put:
 *     summary: Update a student
 *     description: Update student information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal Server Error
 *   
 *   delete:
 *     summary: Delete a student
 *     description: Delete a student record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Student ID
 *     responses:
 *       204:
 *         description: Student deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/admin/buses:
 *   get:
 *     summary: Get all buses
 *     description: Retrieve a list of all buses
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     buses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Bus'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 *   
 *   post:
 *     summary: Create a new bus
 *     description: Create a new bus record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBusRequest'
 *     responses:
 *       201:
 *         description: Bus created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Bus'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/admin/buses/{id}:
 *   put:
 *     summary: Update a bus
 *     description: Update bus information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Bus ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBusRequest'
 *     responses:
 *       200:
 *         description: Bus updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Bus not found
 *       500:
 *         description: Internal Server Error
 *   
 *   delete:
 *     summary: Delete a bus
 *     description: Delete a bus record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Bus ID
 *     responses:
 *       204:
 *         description: Bus deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Bus not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/admin/supervisors:
 *   get:
 *     summary: Get all supervisors
 *     description: Retrieve a list of all supervisors
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supervisors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     supervisors:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Supervisor'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */