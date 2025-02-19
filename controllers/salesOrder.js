
const Order = require('../models/salesOrder');
const Product = require('../models/Product');
const Sale = require('../models/sales');
const sales = require('../models/sales');
const generateInvoicesNumber = require('../helper/index')
exports.createOrder = async (req, res) => {
  try {

    let { customer, products, totalAmount, discount, tax } = req.body;

    totalAmount = 0; // Reset the initial totalAmount to calculate it dynamically.

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product?.name || 'a product'}` });
      }

      // Accumulate the total amount dynamically
      totalAmount += item.price * item.quantity;
      
      // Deduct the purchased quantity from the product stock
      product.quantity -= item.quantity;
      await product.save();
    }

    const invoiceNumber = await generateInvoicesNumber()
    // Create the order
    const order = await Order.create({ products, totalAmount, discount, customer, tax, preparedBy:req.user.id,invoiceNumber });

    // Create a sale record
    const sale = await sales.create({
      order: order._id,
      totalAmount: order.totalAmount,
      paymentMethod: 'none', // Default or pass from request body if needed
      status: 'pending' // Default status
    });

    res.status(201).json({ order, sale });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateOrder = async (req, res) => {
  try {
    const { products, tax, discount } = req.body;
    let totalAmount = 0;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

   
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product?.name || 'a product'}` });
      }
      totalAmount += item.price * item.quantity;
      product.quantity -= item.quantity;
      await product.save();
    }

    totalAmount += tax - discount;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { products, totalAmount, tax, discount },
      { new: true }
    );

    await Sale.findOneAndUpdate(
      { order: req.params.id },
      { totalAmount },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

  
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    // Delete the corresponding Sale entry
    await Sale.findOneAndDelete({ order: req.params.id });

    res.status(200).json({ message: 'Order and related sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    for (const item of order.products) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    order.status = 'canceled';
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getSalesOrders = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;

    const total = await Order.countDocuments();
    const totalPages = Math.ceil(total / size);
    const currentPage = parseInt(page, 10);
    const pageSize = parseInt(size, 10);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const orders = await Order.find()
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .populate('products.product')
      .lean();

    res.status(200).json({
      list: orders,
      total,
      totalPages,
      currentPage,
      pageSize,
      nextPage: hasNextPage ? currentPage + 1 : null,
      prevPage: hasPrevPage ? currentPage - 1 : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};