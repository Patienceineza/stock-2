const express = require('express');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const stockMovementController = require('../controllers/stockMovement');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     StockMovement:
 *       type: object
 *       required:
 *         - type
 *         - product
 *         - quantity
 *         - reason
 *       properties:
 *         type:
 *           type: string
 *           enum: ['entry', 'exit']
 *         product:
 *           type: string
 *           description: The product ID
 *         quantity:
 *           type: number
 *           description: The quantity of the product
 *         reason:
 *           type: string
 *           enum: ['sold', 'returned', 'damaged', 'other']
 *           description: The reason for the stock movement (required for exit)
 *       example:
 *         type: entry
 *         product: 60d0fe4f5311236168a109ca
 *         quantity: 10
 *         reason: sold
 */

/**
 * @swagger
 * tags:
 *   name: StockMovements
 *   description: The stock movements managing API
 */

/**
 * @swagger
 * /api/stock-movements:
 *   get:
 *     summary: Returns the list of all the stock movements
 *     tags: [StockMovements]
 *     responses:
 *       200:
 *         description: The list of the stock movements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockMovement'
 */
router.get('/', stockMovementController.getStockMovements);

/**
 * @swagger
 * /api/stock-movements/{id}:
 *   get:
 *     summary: Get the stock movement by id
 *     tags: [StockMovements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock movement id
 *     responses:
 *       200:
 *         description: The stock movement description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovement'
 *       404:
 *         description: The stock movement was not found
 */
router.get('/:id', stockMovementController.getStockMovementById);

/**
 * @swagger
 * /api/stock-movements:
 *   post:
 *     summary: Create a new stock movement
 *     tags: [StockMovements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockMovement'
 *     responses:
 *       201:
 *         description: The stock movement was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovement'
 *       500:
 *         description: Some server error
 */
router.post('/', stockMovementController.createStockMovement);

/**
 * @swagger
 * /api/stock-movements/{id}:
 *   put:
 *     summary: Update the stock movement by the id
 *     tags: [StockMovements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock movement id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockMovement'
 *     responses:
 *       200:
 *         description: The stock movement was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovement'
 *       404:
 *         description: The stock movement was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:id', stockMovementController.updateStockMovement);

/**
 * @swagger
 * /api/stock-movements/{id}:
 *   delete:
 *     summary: Remove the stock movement by id
 *     tags: [StockMovements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock movement id
 *     responses:
 *       200:
 *         description: The stock movement was deleted
 *       404:
 *         description: The stock movement was not found
 */
router.delete('/:id', stockMovementController.deleteStockMovement);

module.exports = router;