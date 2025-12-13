/**
 * Hybrid Database Connection for Cloudflare D1
 * 
 * Development Mode (npm run dev):
 *   - Uses better-sqlite3 with local file 'local.sqlite'
 *   - No need for Cloudflare Workers runtime
 * 
 * Production Mode (deployed to Cloudflare):
 *   - Uses actual Cloudflare D1 binding
 *   - Accessed via globalThis.DB or environment binding
 */

import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

type DrizzleD1Database = ReturnType<typeof drizzleD1>
type DrizzleSQLiteDatabase = ReturnType<typeof drizzleSQLite>

let db: DrizzleD1Database | DrizzleSQLiteDatabase
let mode: 'local' | 'remote'

// Check if running in Cloudflare Workers environment (has D1 binding)
if (typeof globalThis !== 'undefined' && 'DB' in globalThis) {
  // Production/Wrangler: Use Cloudflare D1 binding
  console.log('🚀 [DB] Running with Cloudflare D1 binding')
  mode = 'remote'
  // @ts-ignore - D1Database is injected by Cloudflare Workers
  db = drizzleD1(globalThis.DB, { schema })
  console.log('✅ [DB] Connected to Cloudflare D1')
} else {
  // Development: Use local SQLite file
  console.log('🔧 [DB] Running in DEVELOPMENT mode')
  console.log('📁 [DB] Using local SQLite file: ./local.sqlite')
  mode = 'local'
  
  const sqlite = new Database('./local.sqlite')
  sqlite.pragma('foreign_keys = ON')
  
  db = drizzleSQLite(sqlite, { schema })
  console.log('✅ [DB] Connected to local SQLite database')
}

export { db }

/**
 * Get database connection
 * Safe to use in Server Actions and API Routes
 */
export function getDb() {
  if (!db) {
    throw new Error('❌ Database connection not initialized')
  }
  return db
}

/**
 * Check if database is connected
 */
export function isDatabaseConnected(): boolean {
  return !!db
}

/**
 * Get current database mode
 */
export function getDatabaseMode(): 'local' | 'remote' {
  return mode
}
