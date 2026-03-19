const { Pool } = require('pg');

// Vercel Postgres uses POSTGRES_URL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { query };
