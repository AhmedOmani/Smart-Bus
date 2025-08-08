/**
 * @swagger
 * components:
 *   schemas:
 *     Supervisor:
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
 *           example: "456 Supervisor Street, Muscat, Oman"
 *         homeLatitude:
 *           type: number
 *           example: 23.5880
 *         homeLongitude:
 *           type: number
 *           example: 58.3829
 *         user:
 *           $ref: '#/components/schemas/User'
 *         bus:
 *           $ref: '#/components/schemas/Bus'
 */

/**
 * @swagger
 * tags:
 *   name: Supervisor
 *   description: Supervisor-specific endpoints
 */

/**
 * @swagger
 * /api/v1/supervisor/my-bus:
 *   get:
 *     summary: Get supervisor's assigned bus
 *     description: Retrieve bus information assigned to the supervisor
 *     tags: [Supervisor]
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
 *         description: Forbidden - Supervisor access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Bus not found or not assigned to supervisor
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
 * /api/v1/supervisor/home-location:
 *   put:
 *     summary: Update supervisor's home location
 *     description: Update the home address and coordinates for the supervisor
 *     tags: [Supervisor]
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
 *                     supervisor:
 *                       $ref: '#/components/schemas/Supervisor'
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
 *         description: Forbidden - Supervisor access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Supervisor not found
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
 * /api/v1/supervisor/profile:
 *   get:
 *     summary: Get supervisor's profile
 *     description: Retrieve the complete profile information for the supervisor
 *     tags: [Supervisor]
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
 *                     supervisor:
 *                       $ref: '#/components/schemas/Supervisor'
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
 *       404:
 *         description: Supervisor not found
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
