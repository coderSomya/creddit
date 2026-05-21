const errorHandler = (err, req, res, next) => {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(404).json({ message: 'Resource not found' });
  }

  // Operational errors thrown with AppError
  if (err.isOperational) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Unexpected errors
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Server error' });
};

module.exports = errorHandler;
