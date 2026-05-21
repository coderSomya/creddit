const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new AppError('username, email and password are required', 400);
  }

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    const field = existing.email === email.toLowerCase() ? 'email' : 'username';
    throw new AppError(`That ${field} is already taken`, 409);
  }

  const user = await User.create({ username, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('email and password are required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user._id);

  res.json({
    token,
    user: { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt },
  });
});

module.exports = { register, login };
