const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin'
  }
}, {
  timestamps: true
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserMongoose = mongoose.model('User', userSchema);

const UserProxy = new Proxy({}, {
  get: (target, prop) => {
    if (process.env.USE_FALLBACK_DB === 'true') {
      const { getFallbackModel } = require('../config/dbFallback');
      return getFallbackModel('User')[prop];
    }
    return UserMongoose[prop];
  }
});

module.exports = UserProxy;
