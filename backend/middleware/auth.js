const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');
const AppError = require('../utils/AppError');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw new AppError('User not found', 401);

  req.user = user;
  next();
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  if (!authHeader.startsWith('Bearer ')) {
    throw new AppError('Invalid authorization header', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw new AppError('User not found', 401);

  req.user = user;
  next();
});

module.exports = { protect, optionalAuth };
