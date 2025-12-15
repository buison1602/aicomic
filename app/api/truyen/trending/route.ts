import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { stories } from '@/db/schema';
import { desc } from 'drizzle-orm';

// API này phải giữ Edge để kết nối D1
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    
    // Lấy 20 truyện mới nhất
    const trendingStories = await db
      .select()
      .from(stories)
      .orderBy(desc(stories.createdAt))
      .limit(20);

    return NextResponse.json(trendingStories);
  } catch (error) {
    console.error('❌ Error fetching trending stories:', error);
    return NextResponse.json(
      { error: 'Không thể tải truyện' },
      { status: 500 }
    );
  }
}
