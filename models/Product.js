const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    price: { type: Number, required: true },
    isUnique: { type: Boolean, default: false }, // If true, each unit has its own barcode
    barcode: { 
      type: String, 
      default: function () { return this.isUnique ? uuidv4() : null; }, 
      unique: true 
    },
    quantity: { 
      type: Number, 
      default: function () { return this.isUnique ? 1 : 0; }, 
      min: function () { return this.isUnique ? 1 : 0; } 
    },
    condition: { 
      type: String, 
      enum: ['New', 'Like New', 'Good', 'Fair'], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['available', 'sold_out'], 
      default: 'available' 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
