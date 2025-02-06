const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  barcode: {
    type: String,
    unique: function() { return this.isUnique; }, // Unique only for unique products
    required: true,
  },
  isUnique: {
    type: Boolean,
    required: true, // Ensures barcode uniqueness if true
  },
  isPrinted: { type: Boolean, default: false },
  isSold: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['printed', 'scanned', 'returned', 'sold'],
    default: 'printed',
  },
}, { timestamps: true });

module.exports = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);