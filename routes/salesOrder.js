const express = require('express');
const SalesOrderController = require('../controllers/salesOrder');
const {authenticate} = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SalesOrder:
 *       type: object
 *       required:
 *         - customer
 *         - items
 *         - totalAmount
 *       properties:
 *         customer:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             address:
 *               type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 format: ObjectId
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *               sku:
 *                 type: string
 *         totalAmount:
 *           type: number
 *         discount:
 *           type: number
 *         tax:
 *           type: number
 *         paymentStatus:
 *           type: string
 *           enum: ['pending', 'received']
 *         orderStatus:
 *           type: string
 *           enum: ['pending', 'completed', 'cancelled']
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/salesOrders:
 *   get:
 *     summary: Get all sales orders
 *     security:
 *       - BearerAuth: []
 *     tags: [SalesOrders]
 *     responses:
 *       200:
 *         description: A list of sales orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalesOrder'
 *       500:
 *         description: Failed to fetch sales orders
 */
router.get('/', authenticate, SalesOrderController.getSalesOrders);

/**
 * @swagger
 * /api/salesOrders/{id}:
 *   get:
 *     summary: Get sales order by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [SalesOrders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales order ID
 *     responses:
 *       200:
 *         description: Sales order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesOrder'
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Failed to fetch sales order
 */
router.get('/:id', authenticate, SalesOrderController.getSalesOrderById);

/**
 * @swagger
 * /api/salesOrders:
 *   post:
 *     summary: Create a new sales order
 *     security:
 *       - BearerAuth: []
 *     tags: [SalesOrders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalesOrder'
 *     responses:
 *       201:
 *         description: Sales order created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Failed to create sales order
 */
router.post('/', authenticate, SalesOrderController.createSalesOrder);

/**
 * @swagger
 * /api/salesOrders/{id}/status:
 *   put:
 *     summary: Update the status of a sales order
 *     security:
 *       - BearerAuth: []
 *     tags: [SalesOrders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['pending', 'completed', 'cancelled']
 *     responses:
 *       200:
 *         description: Sales order status updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Failed to update sales order status
 */
router.put('/:id/status', authenticate, SalesOrderController.updateSalesOrderStatus);

/**
 * @swagger
 * /api/salesOrders/{id}/cancel:
 *   put:
 *     summary: Cancel a pending sales order
 *     security:
 *       - BearerAuth: []
 *     tags: [SalesOrders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales order ID
 *     responses:
 *       200:
 *         description: Sales order cancelled successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Failed to cancel sales order
 */
router.put('/:id/cancel', authenticate, SalesOrderController.cancelSalesOrder);

module.exports = router;