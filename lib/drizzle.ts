import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';

// Validate database configuration
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Initialize drizzle with PostgreSQL
const db = drizzle(pool, { schema });

// Export the database instance and pool for use in the application
export { db, pool };

// Cleanup function for graceful shutdown
export async function closeDatabase() {
  await pool.end();
}