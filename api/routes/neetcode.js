const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.get('/', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../data/neetcode150.json');
    const data = await fs.readFile(dataPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('NeetCode fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch NeetCode data' });
  }
});

module.exports = router;
