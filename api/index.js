const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api', (req, res) => {
  res.send('DSA Tracker Pro API is running on Vercel...');
});

// Import routes
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const leetcodeRoutes = require('./routes/leetcode');
const neetcodeRoutes = require('./routes/neetcode');

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/neetcode', neetcodeRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

module.exports = app;
