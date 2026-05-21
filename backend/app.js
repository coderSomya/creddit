require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const apiRouter = require('./routes');
const errorHandler = require('./middleware/errorHandler');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Creddit API is running' }));
app.use('/api', apiRouter);

app.use(errorHandler);

module.exports = app;
