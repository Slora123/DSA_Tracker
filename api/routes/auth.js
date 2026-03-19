const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built-in Node.js module
const { query } = require('../utils/db');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Signup attempt:', { username, email });
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const { rows: existingUsers } = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Use bcryptjs for hashing
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Use native Node.js crypto for UUID
    const id = crypto.randomUUID();

    const insertQuery = `
      INSERT INTO users (id, username, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email
    `;
    const { rows } = await query(insertQuery, [id, username, email, passwordHash]);
    const newUser = rows[0];

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'secret');
    res.json({
      token,
      user: newUser
    });

  } catch (err) {
    console.error('Signup Error Detail:', err);
    res.status(500).json({ 
      error: "Signup failed", 
      message: err.message,
      code: err.code
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret');
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login Error Detail:', err);
    res.status(500).json({ 
      error: "Login failed", 
      message: err.message
    });
  }
});

module.exports = router;
