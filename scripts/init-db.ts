import pkg from 'pg';
const { Pool } = pkg;
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase() {
  const pool = new Pool({
    user: 'zibsolx',
    password: 'zibsolx_secret',
    host: 'localhost',
    port: 5432,
    database: 'zibsolx'
  });

  try {
    // Read schema file
    const schemaPath = join(__dirname, '..', 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Execute schema
    await pool.query(schema);
    console.log('Database schema initialized successfully');

    // Close pool
    await pool.end();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase().catch(console.error);
