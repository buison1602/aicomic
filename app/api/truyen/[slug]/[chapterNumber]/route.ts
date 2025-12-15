import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { chapterPages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; chapterNumber: string }> }
) {
  try {
    const db = getDb();
    const { slug, chapterNumber } = await params;
    const chapterNum = parseFloat(chapterNumber);

    // Get specific chapter directly by story_slug and chapter_number
    const chapter = (db as any).$client.prepare(
      'SELECT * FROM chapters WHERE story_slug = ? AND chapter_number = ? LIMIT 1'
    ).get(slug, chapterNum) as any;

    if (!chapter) {
      return NextResponse.json(
        { error: 'Không tìm thấy chương' },
        { status: 404 }
      );
    }

    // Get total chapters count for navigation
    const allChapters = (db as any).$client.prepare(
      'SELECT COUNT(*) as count FROM chapters WHERE story_slug = ?'
    ).get(slug) as any;

    // Get all pages for this chapter
    const pages = await db
      .select()
      .from(chapterPages)
      .where(eq(chapterPages.chapterId, chapter.id))
      .all();

    return NextResponse.json({
      chapter: {
        id: chapter.id,
        chapterNumber: chapter.chapter_number,
      },
      pages: pages.map((page: any) => ({
        id: page.id,
        pageNumber: page.pageNumber,
        imageUrl: page.imageUrl,
      })),
      totalChapters: allChapters?.count || 0,
    });
  } catch (error) {
    console.error('❌ Error fetching chapter pages:', error);
    return NextResponse.json(
      { error: 'Không thể tải trang truyện' },
      { status: 500 }
    );
  }
}
