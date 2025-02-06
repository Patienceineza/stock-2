const mongoose = require('mongoose');
const Product = require('../models/Product');
const Inventory = require('../models/inventory');
const StockMovement = require('../models/StockMovement');

exports.createStockMovement = async (req, res) => {
  try { 
    const { type, productId, quantity, reason } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid Product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const stockMovement = new StockMovement({
      type,
      product: productId,
      quantity,
      reason,
    });

    await stockMovement.save();

    if (type === 'entry') {
      if (product.isUnique) {
        for (let i = 0; i < quantity; i++) {
          const inventoryItem = new Inventory({
            product: productId,
            barcode: new mongoose.Types.ObjectId().toString(),
            isUnique: true,
            isPrinted: true,
          });
          await inventoryItem.save();
        }
      } else {
        product.quantity += quantity;
      }
    } else if (type === 'exit') {
      if (product.isUnique) {
        const inventoryItems = await Inventory.find({ product: productId, isSold: false }).limit(quantity);
        if (inventoryItems.length < quantity) {
          return res.status(400).json({ error: 'Not enough inventory items available' });
        }
        for (const item of inventoryItems) {
          item.isSold = reason === 'sold';
          item.status = reason;
          await item.save();
        }
      } else {
        product.quantity -= quantity;
      }
    }

    await product.save();

    res.status(201).json(stockMovement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStockMovement = async (req, res) => {
  try {
    const { type, productId, quantity, reason } = req.body;
    const stockMovement = await StockMovement.findById(req.params.id);

    if (!stockMovement) {
      return res.status(404).json({ error: 'Stock movement not found' });
    }

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid Product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Revert the previous stock movement
    if (stockMovement.type === 'entry') {
      if (product.isUnique) {
        await Inventory.deleteMany({ product: productId, isSold: false, status: 'printed' });
      } else {
        product.quantity -= stockMovement.quantity;
      }
    } else if (stockMovement.type === 'exit') {
      if (product.isUnique) {
        await Inventory.updateMany({ product: productId, status: stockMovement.reason }, { isSold: false, status: 'printed' });
      } else {
        product.quantity += stockMovement.quantity;
      }
    }

    // Apply the new stock movement
    stockMovement.type = type;
    stockMovement.product = productId;
    stockMovement.quantity = quantity;
    stockMovement.reason = reason;

    await stockMovement.save();

    if (type === 'entry') {
      if (product.isUnique) {
        for (let i = 0; i < quantity; i++) {
          const inventoryItem = new Inventory({
            product: productId,
            barcode: new mongoose.Types.ObjectId().toString(),
            isUnique: true,
            isPrinted: true,
          });
          await inventoryItem.save();
        }
      } else {
        product.quantity += quantity;
      }
    } else if (type === 'exit') {
      if (product.isUnique) {
        const inventoryItems = await Inventory.find({ product: productId, isSold: false }).limit(quantity);
        if (inventoryItems.length < quantity) {
          return res.status(400).json({ error: 'Not enough inventory items available' });
        }
        for (const item of inventoryItems) {
          item.isSold = reason === 'sold';
          item.status = reason;
          await item.save();
        }
      } else {
        product.quantity -= quantity;
      }
    }

    await product.save();

    res.status(200).json(stockMovement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStockMovement = async (req, res) => {
  try {
    const stockMovement = await StockMovement.findById(req.params.id);

    if (!stockMovement) {
      return res.status(404).json({ error: 'Stock movement not found' });
    }

    const product = await Product.findById(stockMovement.product);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Revert the stock movement
    if (stockMovement.type === 'entry') {
      if (product.isUnique) {
        await Inventory.deleteMany({ product: stockMovement.product, isSold: false, status: 'printed' });
      } else {
        product.quantity -= stockMovement.quantity;
      }
    } else if (stockMovement.type === 'exit') {
      if (product.isUnique) {
        await Inventory.updateMany({ product: stockMovement.product, status: stockMovement.reason }, { isSold: false, status: 'printed' });
      } else {
        product.quantity += stockMovement.quantity;
      }
    }

    await stockMovement.remove();
    await product.save();

    res.status(200).json({ message: 'Stock movement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStockMovements = async (req, res) => {
  try {
    const stockMovements = await StockMovement.find().populate('product');
    res.status(200).json(stockMovements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStockMovementById = async (req, res) => {
  try {
    const stockMovement = await StockMovement.findById(req.params.id).populate('product');
    if (!stockMovement) {
      return res.status(404).json({ error: 'Stock movement not found' });
    }
    res.status(200).json(stockMovement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};