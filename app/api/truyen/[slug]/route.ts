import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { stories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const db = getDb();
    const { slug } = params;
    
    const story = await db
      .select()
      .from(stories)
      .where(eq(stories.slug, slug))
      .limit(1);

    if (story.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy truyện' },
        { status: 404 }
      );
    }

    return NextResponse.json(story[0]);
  } catch (error) {
    console.error('❌ Error fetching story by slug:', error);
    return NextResponse.json(
      { error: 'Không thể tải thông tin truyện' },
      { status: 500 }
    );
  }
}
