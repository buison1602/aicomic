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
    const chapterIndex = parseInt(chapterNumber);

    // Get all chapters for this story
    const allChapters = (db as any).$client.prepare(
      'SELECT * FROM chapters WHERE story_slug = ? ORDER BY chapter_number'
    ).all(slug) as any[];

    if (allChapters.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy chương' },
        { status: 404 }
      );
    }

    // Get chapter by index (1-based)
    const chapter = allChapters[chapterIndex - 1];

    if (!chapter) {
      return NextResponse.json(
        { error: 'Số chương không hợp lệ' },
        { status: 404 }
      );
    }

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
      totalChapters: allChapters.length,
    });
  } catch (error) {
    console.error('❌ Error fetching chapter pages:', error);
    return NextResponse.json(
      { error: 'Không thể tải trang truyện' },
      { status: 500 }
    );
  }
}
