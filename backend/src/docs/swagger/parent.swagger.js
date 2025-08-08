/**
 * @swagger
 * components:
 *   schemas:
 *     Parent:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         userId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         homeAddress:
 *           type: string
 *           example: "123 Main Street, Muscat, Oman"
 *         homeLatitude:
 *           type: number
 *           example: 23.5880
 *         homeLongitude:
 *           type: number
 *           example: 58.3829
 *         fcmToken:
 *           type: string
 *           example: "firebase-cloud-messaging-token"
 *         user:
 *           $ref: '#/components/schemas/User'
 *     
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         nationalId:
 *           type: string
 *           example: "12345678"
 *         name:
 *           type: string
 *           example: "Jane Doe"
 *         grade:
 *           type: string
 *           example: "Grade 5"
 *         homeAddress:
 *           type: string
 *           example: "123 Main Street, Muscat, Oman"
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           example: "ACTIVE"
 *         bus:
 *           $ref: '#/components/schemas/Bus'
 *     
 *     Bus:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         busNumber:
 *           type: string
 *           example: "Bus 7"
 *         licensePlate:
 *           type: string
 *           example: "9879 اب"
 *         capacity:
 *           type: integer
 *           example: 30
 *         driverName:
 *           type: string
 *           example: "Ahmed Ali"
 *         driverPhone:
 *           type: string
 *           example: "+968 99123456"
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, MAINTENANCE]
 *           example: "ACTIVE"
 *     
 *     ParentDashboard:
 *       type: object
 *       properties:
 *         totalStudents:
 *           type: integer
 *           example: 2
 *         activeStudents:
 *           type: integer
 *           example: 2
 *         busInfo:
 *           $ref: '#/components/schemas/Bus'
 *     
 *     HomeLocationRequest:
 *       type: object
 *       required:
 *         - homeAddress
 *         - homeLatitude
 *         - homeLongitude
 *       properties:
 *         homeAddress:
 *           type: string
 *           minLength: 1
 *           description: Home address
 *           example: "123 Main Street, Muscat, Oman"
 *         homeLatitude:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *           description: Home latitude coordinate
 *           example: 23.5880
 *         homeLongitude:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *           description: Home longitude coordinate
 *           example: 58.3829
 *     
 *     FcmTokenRequest:
 *       type: object
 *       required:
 *         - fcmToken
 *       properties:
 *         fcmToken:
 *           type: string
 *           minLength: 1
 *           description: Firebase Cloud Messaging token
 *           example: "firebase-cloud-messaging-token"
 */

/**
 * @swagger
 * tags:
 *   name: Parent
 *   description: Parent-specific endpoints
 */

/**
 * @swagger
 * /api/v1/parent/dashboard:
 *   get:
 *     summary: Get parent dashboard
 *     description: Retrieve dashboard information for the parent including student count and bus information
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dashboard data fetched successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ParentDashboard'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Parent access required
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
 * /api/v1/parent/students:
 *   get:
 *     summary: Get parent's students
 *     description: Retrieve all students associated with the parent
 *     tags: [Parent]
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Students fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     students:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Parent access required
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
 * /api/v1/parent/my-bus:
 *   get:
 *     summary: Get parent's bus information
 *     description: Retrieve bus information for the parent's children
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bus information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Bus information fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     bus:
 *                       $ref: '#/components/schemas/Bus'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Parent access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Bus not found
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
 * /api/v1/parent/home-location:
 *   put:
 *     summary: Update parent's home location
 *     description: Update the home address and coordinates for the parent
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HomeLocationRequest'
 *     responses:
 *       200:
 *         description: Home location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Home location updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     parent:
 *                       $ref: '#/components/schemas/Parent'
 *       400:
 *         description: Validation error - Invalid coordinates or address
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
 *         description: Forbidden - Parent access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Parent not found
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
 * /api/v1/parent/fcm-token:
 *   put:
 *     summary: Update parent's FCM token
 *     description: Update the Firebase Cloud Messaging token for push notifications
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FcmTokenRequest'
 *     responses:
 *       200:
 *         description: FCM token updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "FCM token updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     parent:
 *                       $ref: '#/components/schemas/Parent'
 *       400:
 *         description: Validation error - Invalid FCM token
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
 *         description: Forbidden - Parent access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Parent not found
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
 * /api/v1/parent/profile:
 *   get:
 *     summary: Get parent's profile
 *     description: Retrieve the complete profile information for the parent
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     parent:
 *                       $ref: '#/components/schemas/Parent'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Parent access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Parent not found
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
