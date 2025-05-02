const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  console.log('Auth headers:', req.headers.authorization ? 'Authorization header exists' : 'No authorization header');

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token ? 'Token exists' : 'No token');

      // Verify token
      console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Secret exists' : 'Secret missing');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully, user id:', decoded.id);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.log('User not found for token');
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
        });
      }

      console.log('User authenticated:', req.user._id, 'Role:', req.user.role);
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        error: error.message
      });
    }
  } else if (!token) {
    console.log('No token provided in request');
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('Admin access granted for user:', req.user._id);
    next();
  } else {
    console.log('Admin access denied for user:', req.user?._id, 'Role:', req.user?.role);
    res.status(403).json({
      success: false,
      message: 'Not authorized as an admin',
    });
  }
};

module.exports = { protect, admin }; 