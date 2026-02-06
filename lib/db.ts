import { Pool } from 'pg';

/**
 * Global connection pool.
 * STRICT REQUIREMENT: Initialize ONE Pool using pg.
 * Reuse it across requests.
 * Do NOT create a new connection per request.
 */

// Use globalThis to maintain the pool across hot reloads in development.
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

// IMMEDIATE INITIALIZATION (Not lazy)
// We check if the global pool exists; if not, we create it immediately.
// This ensures no lazy init penalty on the first health check.
export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true, // Neon requires SSL
    max: 10,   // Reasonable limit for serverless
  });

// Save the pool to global scope in non-production environments
if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}
