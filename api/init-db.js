const fs = require('fs');
const path = require('path');
const { query } = require('./utils/db');
require('dotenv').config();

async function initDB() {
  try {
    console.log('Initializing database...');
    
    const schemaPath = path.join(__dirname, 'data', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements if necessary, 
    // but pg can handle multiple statements in one query if they are separated by semicolons.
    await query(schema);
    
    console.log('Database schema applied successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
}

initDB();
