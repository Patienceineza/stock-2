const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['none', 'cash', 'card', 'mobile'], default: 'none' },
    status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  },
  { timestamps: true }
);

// Middleware: If status is 'pending', set paymentMethod to 'none'
saleSchema.pre('save', function (next) {
  if (this.status === 'pending') {
    this.paymentMethod = 'none';
  }
  next();
});

module.exports = mongoose.model('Sale', saleSchema);
