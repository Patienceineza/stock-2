const Sale = require('../models/sales');
const Product = require('../models/Product');
const Order = require('../models/salesOrder');

exports.getSales = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;

    const total = await Sale.countDocuments();
    const totalPages = Math.ceil(total / size);
    const currentPage = parseInt(page, 10);
    const pageSize = parseInt(size, 10);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const sales = await Sale.find()
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: 'order',
        populate: {
          path: 'products.product', // Populates the product field inside the order
          model: 'Product', // Specify the model to populate from
        },
      })
      .lean();

    res.status(200).json({
      list: sales,
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


exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amountPaid, notes } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const remainingBalance = order.totalAmount - amountPaid;
    if (amountPaid < remainingBalance) {
      return res.status(400).json({ error: 'Insufficient payment amount', remainingBalance });
    }

    const sale = await Sale.findOneAndUpdate(
      { order: orderId },
      { paymentMethod, status: remainingBalance === 0 ? 'Paid' : "half-paid", notes: paymentMethod === "mobile" ? notes : "", remainingAmount:remainingBalance,amountPaid },
      { new: true }
    );

    const newStatus = remainingBalance === 0 ? 'completed' : 'pending';

    await Order.findByIdAndUpdate(orderId, { status: newStatus, amountPaid: amountPaid });

    res.status(200).json({ sale });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.scanBarcode = async (req, res) => {
  try {
    const { barcode } = req.body;
    const product = await Product.findOne({ barcode });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
