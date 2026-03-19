const { query } = require('./utils/db');

async function clear() {
  try {
    console.log('Clearing database...');
    // Clear problems first due to foreign key constraints, then users if needed
    // But usually we just want to clear problems for a fresh start or specific users
    await query('DELETE FROM problems');
    console.log('Problems table cleared!');
  } catch (err) {
    console.error('Error clearing database:', err.message);
  }
}

// clear(); // Run this manually if needed
module.exports = { clear };
