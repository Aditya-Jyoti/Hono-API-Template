import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

// Get absolute path to certificate
const certPath = path.resolve('./ca.pem');
console.log('Certificate path:', certPath);

if (!fs.existsSync(certPath)) {
  throw new Error(`CA certificate not found at ${certPath}`);
}

const sslConfig = {
  ca: fs.readFileSync(certPath).toString(),
  rejectUnauthorized: true,
  // Adding these settings to help with connection
  checkServerIdentity: () => undefined,
  servername: new URL(DATABASE_URL).hostname,
};

console.log('Initializing database connection...');

// Parse the connection string
const dbUrl = new URL(DATABASE_URL);

const pool = new Pool({
  user: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port),
  database: dbUrl.pathname.split('/')[1],

  // Timeouts and pool settings
  connectionTimeoutMillis: 5000, // 5 seconds connection timeout
  idleTimeoutMillis: 30000, // 30 seconds idle timeout
  max: 5, // Maximum 5 clients
  min: 0, // Minimum 0 clients
  ssl: sslConfig,

  // Statement timeout (5 seconds)
  statement_timeout: 5000,

  // Query timeout (5 seconds)
  query_timeout: 5000,
});

// Add event listeners for debugging
pool.on('connect', () => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

pool.on('acquire', () => {
  console.log('Client acquired from pool');
});

pool.on('remove', () => {
  console.log('Client removed from pool');
});

// Test query with timeout
const testConnection = async () => {
  const client = await pool.connect();
  try {
    // Set query-specific timeout via SQL
    const result = await client.query(
      'SET statement_timeout TO 5000; SELECT version()',
    );
    console.log('Database connection successful:', result.rows[0].version);
    return true;
  } catch (err) {
    console.error('Database connection test failed:', err);
    return false;
  } finally {
    client.release();
  }
};

export { pool, testConnection };
