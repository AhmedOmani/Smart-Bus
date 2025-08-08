/**
 * @swagger
 * components:
 *   schemas:
 *     LocationRequest:
 *       type: object
 *       required:
 *         - latitude
 *         - longitude
 *       properties:
 *         latitude:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *           description: Bus latitude coordinate
 *           example: 23.5880
 *         longitude:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *           description: Bus longitude coordinate
 *           example: 58.3829
 *     
 *     LocationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Location saved successfully"
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "123e4567-e89b-12d3-a456-426614174000"
 *             latitude:
 *               type: number
 *               example: 23.5880
 *             longitude:
 *               type: number
 *               example: 58.3829
 *             timestamp:
 *               type: string
 *               format: date-time
 *               example: "2024-01-01T12:00:00.000Z"
 *             busId:
 *               type: string
 *               format: uuid
 *               example: "123e4567-e89b-12d3-a456-426614174000"
 */

/**
 * @swagger
 * tags:
 *   name: Bus Tracking
 *   description: Bus location tracking endpoints
 */

/**
 * @swagger
 * /api/v1/bus/location:
 *   post:
 *     summary: Save bus location
 *     description: Save the current location of the bus. Only supervisors can save location for their assigned bus.
 *     tags: [Bus Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationRequest'
 *     responses:
 *       201:
 *         description: Location saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationResponse'
 *       400:
 *         description: Validation error - Invalid latitude or longitude
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
 *         description: Forbidden - Only supervisors can save location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Bus not found for this supervisor
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
