const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'learts_super_secret_jwt_key_12345', {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register a new admin user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password',
        data: null
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists',
        data: null
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    if (user) {
      return res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id)
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data',
        data: null
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
      data: null
    });
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
        data: null
      });
    }

    // Check for user
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id)
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
        data: null
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
      data: null
    });
  }
};

module.exports = {
  register,
  login
};
