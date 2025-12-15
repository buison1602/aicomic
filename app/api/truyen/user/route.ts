import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { stories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập' },
        { status: 401 }
      );
    }

    const db = getDb();
    
    const userStories = await db
      .select()
      .from(stories)
      .where(eq(stories.userId, session.user.id));

    return NextResponse.json(userStories);
  } catch (error) {
    console.error('❌ Error fetching user stories:', error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách truyện' },
      { status: 500 }
    );
  }
}
