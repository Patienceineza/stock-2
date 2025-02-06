const salesOrderService = require('../services/salesOrder');

exports.createSalesOrder = async (req, res) => {
  try {
    const salesOrder = await salesOrderService.createSalesOrder(req.body);
    res.status(201).json(salesOrder);
  } catch (error) {
    console.error('Error creating sales order:', error);
    res.status(500).json({ error: 'Failed to create sales order' });
  }
};

exports.getSalesOrders = async (req, res) => {
  try {
    const result = await salesOrderService.getSalesOrders(req.query);
    res.status(200).json(result); // Send the paginated response
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    res.status(500).json({ error: 'Failed to fetch sales orders' });
  }
};

exports.getSalesOrderById = async (req, res) => {
  try {
    const salesOrder = await salesOrderService.getSalesOrderById(req.params.id);

    if (!salesOrder) {
      return res.status(404).json({ error: 'Sales order not found' });
    }

    res.json(salesOrder);
  } catch (error) {
    console.error('Error fetching sales order:', error);
    res.status(500).json({ error: 'Failed to fetch sales order' });
  }
};

exports.updateSalesOrderStatus = async (req, res) => {
  try {
    const salesOrder = await salesOrderService.updateSalesOrderStatus(req.params.id, req.body.status);
    res.json(salesOrder);
  } catch (error) {
    if (error.message === 'Sales order not found') {
      return res.status(404).json({ error: 'Sales order not found' });
    } else {
      console.error('Error updating sales order status:', error);
      return res.status(500).json({ error: error.message });
    }
  }
};

exports.cancelSalesOrder = async (req, res) => {
  try {
    const salesOrder = await salesOrderService.cancelSalesOrder(req.params.id);
    res.json(salesOrder);
  } catch (error) {
    if (error.message === 'Sales order not found') {
      return res.status(404).json({ error: 'Sales order not found' });
    } else {
      console.error('Error canceling sales order:', error);
      return res.status(500).json({ error: error.message });
    }
  }
};