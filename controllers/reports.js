const Inventory = require('../models/Inventory');
const SalesOrder = require('../models/salesOrder');
const Product = require('../models/Product');

exports.getInventoryReport = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find().populate('product');
    const report = inventoryItems.map(item => {
      let status = 'abundant';
      if (item.quantity === 0) {
        status = 'none';
      } else if (item.quantity < 10) {
        status = 'low';
      }
      return {
        product: item.product._id,
        quantity: item.quantity,
        status,
      };
    });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory report' });
  }
};

exports.getInventoryReportByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const inventoryItem = await Inventory.findOne({ product: productId }).populate('product');
    if (!inventoryItem) {
      return res.status(404).json({ error: 'Product not found in inventory' });
    }
    let status = 'abundant';
    if (inventoryItem.quantity === 0) {
      status = 'none';
    } else if (inventoryItem.quantity < 10) {
      status = 'low';
    }
    res.json({
      product: inventoryItem.product._id,
      quantity: inventoryItem.quantity,
      status,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory report' });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const salesOrders = await SalesOrder.find().populate('items.product');
    let totalSales = 0;
    let totalProfit = 0;
    const productSales = {};

    salesOrders.forEach(order => {
      totalSales += order.totalAmount;
      order.items.forEach(item => {
        const profit = item.price - item.product.buyingPrice;
        totalProfit += profit * item.quantity;
        if (!productSales[item.product._id]) {
          productSales[item.product._id] = { quantity: 0, totalSales: 0 };
        }
        productSales[item.product._id].quantity += item.quantity;
        productSales[item.product._id].totalSales += item.price * item.quantity;
      });
    });

    const topSellingProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b.quantity - a.quantity)
      .slice(0, 5)
      .map(([productId, data]) => ({ productId, ...data }));

    res.json({
      totalSales,
      totalProfit,
      topSellingProducts,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales report' });
  }
};

exports.getSalesReportByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const salesOrders = await SalesOrder.find({ 'items.product': productId }).populate('items.product');
    let totalSales = 0;
    let totalProfit = 0;
    let quantitySold = 0;

    salesOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product._id.toString() === productId) {
          totalSales += item.price * item.quantity;
          const profit = item.price - item.product.buyingPrice;
          totalProfit += profit * item.quantity;
          quantitySold += item.quantity;
        }
      });
    });

    res.json({
      totalSales,
      totalProfit,
      quantitySold,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales report' });
  }
};