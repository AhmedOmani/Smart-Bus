/**
 * @swagger
 * components:
 *   schemas:
 *     Absence:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         studentId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         reportedBy:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         reportedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T10:00:00.000Z"
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2024-01-02T00:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2024-01-03T00:00:00.000Z"
 *         reason:
 *           type: string
 *           example: "Doctor appointment"
 *         type:
 *           type: string
 *           enum: [SICK, PERSONAL, SCHOOL_EVENT, OTHER]
 *           example: "SICK"
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *           example: "PENDING"
 *         approvedBy:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         approvedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T15:00:00.000Z"
 *         notes:
 *           type: string
 *           example: "Supervisor notes about the absence"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T15:00:00.000Z"
 *         student:
 *           $ref: '#/components/schemas/Student'
 *     
 *     ReportAbsenceRequest:
 *       type: object
 *       required:
 *         - studentId
 *         - startDate
 *         - endDate
 *         - type
 *       properties:
 *         studentId:
 *           type: string
 *           format: uuid
 *           description: ID of the student who will be absent
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Start date of absence (ISO 8601 format)
 *           example: "2024-01-02T00:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: End date of absence (ISO 8601 format)
 *           example: "2024-01-03T00:00:00.000Z"
 *         reason:
 *           type: string
 *           maxLength: 500
 *           description: Optional reason for absence
 *           example: "Doctor appointment"
 *         type:
 *           type: string
 *           enum: [SICK, PERSONAL, SCHOOL_EVENT, OTHER]
 *           description: Type of absence
 *           example: "SICK"
 *     
 *     UpdateAbsenceStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [APPROVED, REJECTED]
 *           description: New status for the absence
 *           example: "APPROVED"
 *         notes:
 *           type: string
 *           maxLength: 500
 *           description: Optional supervisor notes
 *           example: "Approved due to medical reasons"
 */

/**
 * @swagger
 * tags:
 *   name: Absence Management
 *   description: Student absence reporting and management endpoints
 */

/**
 * @swagger
 * /api/v1/absence/report:
 *   post:
 *     summary: Report student absence
 *     description: Parent reports an absence for their child. Start date cannot be in the past and end date must be after or equal to start date.
 *     tags: [Absence Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReportAbsenceRequest'
 *     responses:
 *       201:
 *         description: Absence reported successfully
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
 *                   example: "Absence reported successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Absence'
 *       400:
 *         description: Validation error - Invalid dates or missing required fields
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
 *         description: Student not found or not authorized
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
 * /api/v1/absence/student/{studentId}:
 *   get:
 *     summary: Get absences by student ID
 *     description: Retrieve all absences for a specific student. Parents can only access their own children's absences.
 *     tags: [Absence Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Student ID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Absences retrieved successfully
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
 *                   example: "Absences fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Absence'
 *       400:
 *         description: Validation error - Invalid student ID format
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
 *         description: Forbidden - Not authorized to view this student's absences
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Student not found
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
 * /api/v1/absence/supervisor/pending:
 *   get:
 *     summary: Get pending absences for supervisor
 *     description: Retrieve all pending absences for students assigned to the supervisor's bus
 *     tags: [Absence Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending absences retrieved successfully
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
 *                   example: "Pending absences fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Absence'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Supervisor access required
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
 * /api/v1/absence/{absenceId}/status:
 *   put:
 *     summary: Update absence status
 *     description: Supervisor approves or rejects a student absence request
 *     tags: [Absence Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: absenceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Absence ID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAbsenceStatusRequest'
 *     responses:
 *       200:
 *         description: Absence status updated successfully
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
 *                   example: "Absence status updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Absence'
 *       400:
 *         description: Validation error - Invalid status or absence ID
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
 *         description: Forbidden - Supervisor access required or not authorized for this bus
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Absence not found or bus not found for supervisor
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
 * /api/v1/absence/{absenceId}:
 *   get:
 *     summary: Get specific absence by ID
 *     description: Retrieve detailed information about a specific absence. Parents can only access their children's absences, supervisors can access absences for their bus students.
 *     tags: [Absence Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: absenceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Absence ID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Absence retrieved successfully
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
 *                   example: "Absence retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Absence'
 *       400:
 *         description: Validation error - Invalid absence ID format
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
 *         description: Forbidden - Not authorized to view this absence
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Absence not found
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
