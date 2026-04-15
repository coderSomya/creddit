require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
