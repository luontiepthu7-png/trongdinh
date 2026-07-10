const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const CategoryMongoose = mongoose.model('Category', categorySchema);

const CategoryProxy = new Proxy({}, {
  get: (target, prop) => {
    if (process.env.USE_FALLBACK_DB === 'true') {
      const { getFallbackModel } = require('../config/dbFallback');
      return getFallbackModel('Category')[prop];
    }
    return CategoryMongoose[prop];
  }
});

module.exports = CategoryProxy;
