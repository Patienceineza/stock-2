// const express = require('express');
// const InventoryController = require('../controllers/inventory');
// const {authenticate} = require('../middlewares/auth');

// const router = express.Router();

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     InventoryUnit:
//  *       type: object
//  *       required:
//  *         - product
//  *         - quantity
//  *         - buyingPrice
//  *         - sellingPrice
//  *       properties:
//  *         product:
//  *           type: string
//  *           description: The ID of the product
//  *         quantity:
//  *           type: number
//  *           description: The quantity of the product
//  *         buyingPrice:
//  *           type: number
//  *           description: The buying price of the product
//  *         sellingPrice:
//  *           type: number
//  *           description: The selling price of the product
//  *         location:
//  *           type: string
//  *           description: The location of the product
//  *     InventorySummary:
//  *       type: object
//  *       properties:
//  *         _id:
//  *           type: string
//  *           description: The ID of the product
//  *         totalQuantity:
//  *           type: number
//  *           description: The total quantity of the product
//  *         productName:
//  *           type: string
//  *           description: The name of the product
//  */

// /**
//  * @swagger
//  * /api/inventory:
//  *   get:
//  *     summary: Get all inventory items
//  *     tags: [Inventory]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *         description: The page number
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *         description: The number of items per page
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *         description: Search term for SKU
//  *       - in: query
//  *         name: product
//  *         schema:
//  *           type: string
//  *         description: The ID of the product
//  *     responses:
//  *       200:
//  *         description: A list of inventory items
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 list:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/InventoryUnit'
//  *                 total:
//  *                   type: integer
//  *                   description: The total number of items
//  *                 totalPages:
//  *                   type: integer
//  *                   description: The total number of pages
//  *                 currentPage:
//  *                   type: integer
//  *                   description: The current page number
//  *                 nextPage:
//  *                   type: integer
//  *                   description: The next page number
//  *                 prevPage:
//  *                   type: integer
//  *                   description: The previous page number
//  *       500:
//  *         description: Failed to fetch inventory items
//  */

// /**
//  * @swagger
//  * /inventory/{id}:
//  *   get:
//  *     summary: Get inventory item by ID
//  *     tags: [Inventory]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the inventory item
//  *     responses:
//  *       200:
//  *         description: Inventory item details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/InventoryUnit'
//  *       404:
//  *         description: Inventory item not found
//  *       500:
//  *         description: Failed to fetch inventory item
//  */

// /**
//  * @swagger
//  * /inventory/unit:
//  *   post:
//  *     summary: Create a new inventory unit
//  *     tags: [Inventory]
//  *     security:
//  *       - BearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/InventoryUnit'
//  *     responses:
//  *       201:
//  *         description: Inventory unit created successfully
//  *       500:
//  *         description: Failed to create inventory unit
//  */

// /**
//  * @swagger
//  * /inventory/summary:
//  *   get:
//  *     summary: Get inventory summary report
//  *     tags: [Inventory]
//  *     security:
//  *       - BearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Inventory summary report
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/InventorySummary'
//  *       500:
//  *         description: Failed to fetch summary report
//  */
// router.get('/', authenticate, InventoryController.getInventoryItems);
// router.get('/:id', authenticate, InventoryController.getInventoryItemById);
// router.post('/unit', authenticate, InventoryController.createInventoryUnit);
// router.get('/summary', authenticate, InventoryController.getSummaryReport);

// module.exports = router;