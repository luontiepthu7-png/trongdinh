const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'learts_super_secret_jwt_key_12345');

      // Get user from token
      const userResult = User.findById(decoded.id);
      let user;
      if (userResult && typeof userResult.select === 'function') {
        user = await userResult.select('-password');
      } else {
        user = await userResult;
        if (user) {
          user = { ...user };
          delete user.password;
        }
      }
      req.user = user;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
          data: null
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        data: null
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
      data: null
    });
  }
};

module.exports = { protect };
