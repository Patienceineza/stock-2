const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const inventoryUnitSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sku: { type: String, unique: true, default: uuidv4 },
  quantity: { type: Number, required: true },
  buyingPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  location: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.InventoryUnit || mongoose.model('InventoryUnit', inventoryUnitSchema);