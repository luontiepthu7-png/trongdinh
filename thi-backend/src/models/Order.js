const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone number is required'],
    trim: true
  },
  customerAddress: {
    type: String,
    required: [true, 'Customer address is required'],
    trim: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  items: [orderItemSchema]
}, {
  timestamps: true
});

const OrderMongoose = mongoose.model('Order', orderSchema);

const OrderProxy = new Proxy({}, {
  get: (target, prop) => {
    if (process.env.USE_FALLBACK_DB === 'true') {
      const { getFallbackModel } = require('../config/dbFallback');
      return getFallbackModel('Order')[prop];
    }
    return OrderMongoose[prop];
  }
});

module.exports = OrderProxy;
