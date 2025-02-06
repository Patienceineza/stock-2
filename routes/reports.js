const express = require('express');
const reportsController = require('../controllers/reports');
const {authenticate} = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /api/reports/inventory:
 *   get:
 *     summary: Get inventory report
 *     security:
 *       - BearerAuth: []
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Inventory report
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product:
 *                     type: string
 *                     format: ObjectId
 *                   quantity:
 *                     type: number
 *                   status:
 *                     type: string
 *                     enum: ['low', 'none', 'abundant']
 *       500:
 *         description: Failed to fetch inventory report
 */
router.get('/inventory', authenticate, reportsController.getInventoryReport);

/**
 * @swagger
 * /api/reports/inventory/{productId}:
 *   get:
 *     summary: Get inventory report by product ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Inventory report by product ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: string
 *                   format: ObjectId
 *                 quantity:
 *                   type: number
 *                 status:
 *                   type: string
 *                   enum: ['low', 'none', 'abundant']
 *       500:
 *         description: Failed to fetch inventory report
 */
router.get('/inventory/:productId', authenticate, reportsController.getInventoryReportByProductId);

/**
 * @swagger
 * /api/reports/sales:
 *   get:
 *     summary: Get sales report
 *     security:
 *       - BearerAuth: []
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Sales report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: number
 *                 totalProfit:
 *                   type: number
 *                 topSellingProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         format: ObjectId
 *                       quantity:
 *                         type: number
 *                       totalSales:
 *                         type: number
 *       500:
 *         description: Failed to fetch sales report
 */
router.get('/sales', authenticate, reportsController.getSalesReport);

/**
 * @swagger
 * /api/reports/sales/{productId}:
 *   get:
 *     summary: Get sales report by product ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Sales report by product ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: number
 *                 totalProfit:
 *                   type: number
 *                 quantitySold:
 *                   type: number
 *       500:
 *         description: Failed to fetch sales report
 */
router.get('/sales/:productId', authenticate, reportsController.getSalesReportByProductId);

module.exports = router;