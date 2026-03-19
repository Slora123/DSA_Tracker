const { Pool } = require('pg');

module.exports = async (req, res) => {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    return res.status(500).json({ status: 'error', message: 'No connection string found.' });
  }

  const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const dbTest = await pool.query('SELECT NOW()');
    
    // Check tables
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tables = tableCheck.rows.map(r => r.table_name);
    const hasUsers = tables.includes('users');
    const hasProblems = tables.includes('problems');

    res.status(200).json({
      status: 'success',
      message: 'Database connection established!',
      detectedTables: tables,
      schemaStatus: (hasUsers && hasProblems) ? 'Complete' : 'Missing tables',
      missing: {
        users: !hasUsers,
        problems: !hasProblems
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  } finally {
    await pool.end();
  }
};
