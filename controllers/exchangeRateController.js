const ExchangeRate = require('../models/ExchangeRate');

// This is to get the current exchange rate
exports.getExchangeRate = async (req, res) => {
  try {
    const latestRate = await ExchangeRate.findOne().sort({ updatedAt: -1 });
    if (!latestRate) {
      return res.status(404).json({ message: 'Exchange rate not found' });
    }
    res.status(200).json({ rate: latestRate.rate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// This is to update the exchange rate (Admin only)
exports.updateExchangeRate = async (req, res) => {
  try {
    const { rate } = req.body;
    const updatedBy = req.user.id; 

    if (!rate || isNaN(rate)) {
      return res.status(400).json({ message: 'Invalid rate provided' });
    }

    const newExchangeRate = new ExchangeRate({ rate, updatedBy });
    await newExchangeRate.save();

    res.status(200).json({ message: 'Exchange rate updated successfully', rate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};