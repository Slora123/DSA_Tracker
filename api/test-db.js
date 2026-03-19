const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('Testing connection to:', (process.env.POSTGRES_URL || process.env.DATABASE_URL)?.split('@')[1]);
    const res = await pool.query('SELECT NOW()');
    console.log('Connection successful!', res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
