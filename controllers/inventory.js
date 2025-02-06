const inventoryService = require('../services/inventory');

exports.getInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await inventoryService.getInventoryItems(req.query);
    res.json(inventoryItems);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
};

exports.getInventoryItemById = async (req, res) => {
  try {
    const inventoryItem = await inventoryService.getInventoryItemById(req.params.id);

    if (!inventoryItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json(inventoryItem);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Failed to fetch inventory item' });
  }
};

exports.createInventoryUnit = async (req, res) => {
  try {
    const inventoryUnit = await inventoryService.createInventoryUnit(req.body);
    res.status(201).json(inventoryUnit);
  } catch (error) {
    console.error('Error creating inventory unit:', error);
    res.status(500).json({ error: 'Failed to create inventory unit' });
  }
};

exports.getInventoryUnits = async (req, res) => {
  try {
    const inventoryUnits = await inventoryService.getInventoryUnits(req.query);
    res.json(inventoryUnits);
  } catch (error) {
    console.error('Error fetching inventory units:', error);
    res.status(500).json({ error: 'Failed to fetch inventory units' });
  }
};

exports.getSummaryReport = async (req, res) => {
  try {
    const summary = await inventoryService.getSummaryReport();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching summary report:', error);
    res.status(500).json({ error: 'Failed to fetch summary report' });
  }
};