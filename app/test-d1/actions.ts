'use server';

import { getDb, getDatabaseMode } from '@/db';
import { sql } from 'drizzle-orm';

export async function testDatabase() {
  try {
    const db = getDb();
    const mode = getDatabaseMode();

    // Use raw SQL for counting - works with both SQLite and D1
    const result = await db.get<{ count: number }>(
      sql.raw('SELECT COUNT(*) as count FROM stories')
    );
    const storyCount = result?.count || 0;

    return {
      success: true,
      mode,
      count: storyCount,
      message: `Successfully connected to ${mode === 'local' ? 'Local SQLite' : 'Cloudflare D1'} database. Found ${storyCount} stories.`,
    };
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return {
      success: false,
      mode: 'unknown',
      count: 0,
      message: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}
