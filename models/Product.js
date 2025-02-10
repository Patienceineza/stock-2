const mongoose = require('mongoose');
const shortid = require('shortid');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    price: { type: Number, required: true },
    isUnique: { type: Boolean, required: true },
    barcode: {
      type: String,
      unique: true,
      default: shortid.generate,
    },
    quantity: {
      type: Number,
      default: function () {
        return this.isUnique ? 1 : 0;
      },
      min: 0,
    },
    colors: { type: String, default: '' },
    sizes: { type: String, default: '' },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair'],
      required: true,
    },
    status: { type: String, enum: ['available', 'sold_out'], default: 'available' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Pre-save hook to update the status based on quantity
productSchema.pre('save', function (next) {
  if (this.quantity === 0) {
    this.status = 'sold_out';
  } else {
    this.status = 'available';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
