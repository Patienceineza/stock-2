const express = require('express');
const SalesOrderController = require('../controllers/salesOrder'); 
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SalesOrder:
 *       type: object
 *       required:
 *         - customer
 *         - products
 *         - totalAmount
 *       properties:
 *         customer:
 *           type: string
 *           description: Customer name
 *         products:
 *           type: array
 *           description: List of products in the order
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 format: ObjectId
 *                 description: Product ID reference
 *               quantity:
 *                 type: number
 *                 description: Number of units ordered
 *                 minimum: 1
 *               price:
 *                 type: number
 *                 description: Price per unit of the product
 *         totalAmount:
 *           type: number
 *           description: Total amount for the order
 *         discount:
 *           type: number
 *           description: Discount applied to the order
 *           default: 0
 *         tax:
 *           type: number
 *           description: Tax applied to the order
 *           default: 0
 *         status:
 *           type: string
 *           enum: ['pending', 'completed', 'canceled']
 *           description: Order status
 *           default: 'pending'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
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
router.post('/', authenticate, SalesOrderController.createOrder);

/**
 * @swagger
 * /api/salesOrders/{id}:
 *   put:
 *     summary: Update an existing sales order
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
 *             $ref: '#/components/schemas/SalesOrder'
 *     responses:
 *       200:
 *         description: Sales order updated successfully
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Failed to update sales order
 */
router.put('/:id', authenticate, SalesOrderController.updateOrder);

/**
 * @swagger
 * /api/salesOrders/{id}:
 *   delete:
 *     summary: Delete a sales order
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
 *         description: Sales order deleted successfully
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Failed to delete sales order
 */
router.delete('/:id', authenticate, SalesOrderController.deleteOrder);

module.exports = router;
