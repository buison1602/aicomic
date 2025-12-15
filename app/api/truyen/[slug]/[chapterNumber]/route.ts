import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; chapterNumber: string }> }
) {
  try {
    const { slug, chapterNumber } = await params;
    const chapterNum = parseFloat(chapterNumber);

    // Get DB binding directly from environment
    const dbBinding = (process.env as any).DB || (globalThis as any).DB;
    
    if (!dbBinding) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }

    // Query chapter directly using D1 SQL API
    const chapterResult = await dbBinding.prepare(
      'SELECT * FROM chapters WHERE story_slug = ? AND chapter_number = ? LIMIT 1'
    ).bind(slug, chapterNum).first();

    if (!chapterResult) {
      return NextResponse.json(
        { error: 'Không tìm thấy chương' },
        { status: 404 }
      );
    }

    // Get total chapters count
    const countResult = await dbBinding.prepare(
      'SELECT COUNT(*) as count FROM chapters WHERE story_slug = ?'
    ).bind(slug).first();

    // Get all pages for this chapter using D1 SQL API
    const pagesResult = await dbBinding.prepare(
      'SELECT * FROM chapter_pages WHERE chapter_id = ? ORDER BY page_number ASC'
    ).bind(chapterResult.id).all();

    const pages = pagesResult.results || [];

    return NextResponse.json({
      chapter: {
        id: chapterResult.id,
        chapterNumber: chapterResult.chapter_number,
      },
      pages: pages.map((page: any) => ({
        id: page.id,
        pageNumber: page.page_number,
        imageUrl: page.image_url,
      })),
      totalChapters: countResult?.count || 0,
    });
  } catch (error) {
    console.error('❌ Error fetching chapter pages:', error);
    return NextResponse.json(
      { error: 'Không thể tải trang truyện' },
      { status: 500 }
    );
  }
}
