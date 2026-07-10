const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  badge: {
    type: String,
    enum: ['none', 'hot', 'new', 'sale'],
    default: 'none'
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image URL is required']
  },
  stock: {
    type: Number,
    required: [true, 'Stock count is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category ID is required']
  }
}, {
  timestamps: true
});

const ProductMongoose = mongoose.model('Product', productSchema);

const ProductProxy = new Proxy({}, {
  get: (target, prop) => {
    if (process.env.USE_FALLBACK_DB === 'true') {
      const { getFallbackModel } = require('../config/dbFallback');
      return getFallbackModel('Product')[prop];
    }
    return ProductMongoose[prop];
  }
});

module.exports = ProductProxy;
