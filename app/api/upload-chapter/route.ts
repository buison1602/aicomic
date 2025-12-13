import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDb } from '@/db';
import { stories, chapters, chapterPages } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { uploadChapterImages } from '@/lib/r2-upload';

export async function POST(req: NextRequest) {
  try {
    const db = getDb();

    // Parse FormData
    const formData = await req.formData();
    const storySlug = formData.get('storySlug') as string;
    const imageFiles = formData.getAll('images') as File[];

    console.log('📚 API Route - Upload chapter request:', {
      storySlug,
      imageCount: imageFiles.length,
      imageSizes: imageFiles.map(f => `${f.name}: ${(f.size / 1024).toFixed(2)}KB`),
    });

    // Validate inputs
    if (!storySlug || imageFiles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Thiếu thông tin: storySlug hoặc images',
        },
        { status: 400 }
      );
    }

    // Verify story exists
    const story = await db
      .select()
      .from(stories)
      .where(eq(stories.slug, storySlug))
      .limit(1);

    if (story.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Không tìm thấy truyện với slug: ${storySlug}`,
        },
        { status: 404 }
      );
    }

    // Auto-calculate next chapter number (count existing chapters + 1)
    const existingChapters = await db
      .select()
      .from(chapters)
      .where(eq(chapters.storySlug, storySlug))
      .all();

    const chapterNum = existingChapters.length + 1;

    console.log(`📊 Found ${existingChapters.length} existing chapters, creating chapter ${chapterNum}`);

    // Validate image files
    for (const file of imageFiles) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          {
            success: false,
            message: `File ${file.name} không phải là ảnh`,
          },
          { status: 400 }
        );
      }
    }

    console.log('✅ Validation passed, creating chapter...');

    // Insert chapter record
    const [newChapter] = await db
      .insert(chapters)
      .values({
        storySlug,
        chapterNumber: chapterNum,
        createdAt: new Date().toISOString(),
      })
      .returning();

    console.log(`📖 Chapter created with ID: ${newChapter.id}`);

    // Upload images in parallel
    const imageUrls = await uploadChapterImages(imageFiles, storySlug, chapterNum);

    console.log(`🖼️ Uploaded ${imageUrls.length} images`);

    // Create chapter pages records
    const pageRecords = imageUrls.map((url, index) => ({
      chapterId: newChapter.id,
      imageUrl: url,
      pageNumber: index + 1,
    }));

    await db.insert(chapterPages).values(pageRecords);

    console.log(`✅ Created ${pageRecords.length} chapter pages`);

    // Invalidate cache for this story
    revalidateTag(`story-${storySlug}`, {});
    revalidateTag('stories', {});
    console.log(`🔄 Cache invalidated for story: ${storySlug}`);

    return NextResponse.json(
      {
        success: true,
        message: `Đã đăng chương ${chapterNum} với ${imageUrls.length} trang thành công!`,
        chapterId: newChapter.id,
        chapterNumber: chapterNum,
        pageCount: imageUrls.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ API Route - Upload chapter error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng chương',
      },
      { status: 500 }
    );
  }
}
