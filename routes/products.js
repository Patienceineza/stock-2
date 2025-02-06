const express = require('express');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const productController = require('../controllers/products');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - isUnique
 *         - condition
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         category:
 *           type: string
 *           description: The category ID
 *         price:
 *           type: number
 *         isUnique:
 *           type: boolean
 *         barcode:
 *           type: string
 *         quantity:
 *           type: number
 *           default: 0
 *         condition:
 *           type: string
 *           enum: ['New', 'Like New', 'Good', 'Fair']
 *         status:
 *           type: string
 *           enum: ['available', 'sold_out']
 *           default: 'available'
 *       example:
 *         name: "Product Name"
 *         description: "Product Description"
 *         image: "http://example.com/image.jpg"
 *         category: "60d0fe4f5311236168a109ca"
 *         price: 100
 *         isUnique: true
 *         barcode: "1234567890123"
 *         quantity: 1
 *         condition: "New"
 *         status: "available"
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */
router.post('/', productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update the product by the id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:id', authenticate, authorizeRoles('admin'), productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Remove the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product was deleted
 *       404:
 *         description: The product was not found
 */
router.delete('/:id', authenticate, authorizeRoles('admin'), productController.deleteProduct);

module.exports = router;