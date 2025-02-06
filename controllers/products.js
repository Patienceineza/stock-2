const productService = require('../services/product');
const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Product name is required.',
    'string.empty': 'Product name cannot be empty.',
  }),
  description: Joi.string().optional(),
  image: Joi.string().optional(),
  category: Joi.string().optional(),
  price: Joi.number().required().messages({
    'any.required': 'Price is required.',
    'number.base': 'Price must be a number.',
  }),
  isUnique: Joi.boolean().required().messages({
    'any.required': 'isUnique field is required.',
  }),
  quantity: Joi.when('isUnique', {
    is: true,
    then: Joi.number().valid(1).messages({
      'any.only': 'Quantity must be exactly 1 when isUnique is true.',
    }),
    otherwise: Joi.number().min(0).messages({
      'number.min': 'Quantity cannot be less than 0.',
    }),
  }).default(0),
  condition: Joi.string().valid('New', 'Like New', 'Good', 'Fair').required().messages({
    'any.required': 'Condition is required.',
    'any.only': 'Condition must be one of: New, Like New, Good, Fair.',
  }),
  status: Joi.string().valid('available', 'sold_out').default('available'),
});


exports.getProducts = async (req, res) => {
  try {
    const result = await productService.getProducts(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const product = await productService.createProduct(value);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const product = await productService.updateProduct(req.params.id, value);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
