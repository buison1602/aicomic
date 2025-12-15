import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { stories } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    
    // Lấy tất cả truyện
    const allStories = await db
      .select()
      .from(stories)
      .orderBy(desc(stories.createdAt));

    return NextResponse.json(allStories);
  } catch (error) {
    console.error('❌ Error fetching all stories:', error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách truyện' },
      { status: 500 }
    );
  }
}
