'use server';

import { revalidateTag } from 'next/cache';
import { getDb } from '@/db';
import { stories, chapters, chapterPages } from '@/db/schema';
import { uploadChapterImages } from '@/lib/r2-upload';
import { eq } from 'drizzle-orm';

export async function getStoryBySlug(slug: string) {
  try {
    const db = getDb();

    const result = await db.select().from(stories).where(eq(stories.slug, slug)).limit(1);

    if (result.length === 0) {
      return {
        success: false,
        story: null,
      };
    }

    const story = result[0];
    return {
      success: true,
      story: {
        id: story.id,
        slug: story.slug,
        title: story.title,
        thumbnailUrl: story.thumbnailUrl,
      },
    };
  } catch (error) {
    console.error('❌ Fetch story error:', error);
    return {
      success: false,
      story: null,
    };
  }
}

export async function createChapter(formData: FormData) {
  try {
    const db = getDb();

    // Extract form data
    const storySlug = formData.get('storySlug') as string;
    const imageFiles = formData.getAll('images') as File[];

    // Validate
    if (!storySlug || imageFiles.length === 0) {
      return {
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin',
      };
    }

    // Check if story exists
    const story = await db.select().from(stories).where(eq(stories.slug, storySlug)).limit(1);
    if (story.length === 0) {
      return {
        success: false,
        message: 'Không tìm thấy truyện',
      };
    }

    // Auto-calculate next chapter number (count existing chapters + 1)
    const existingChapters = await db
      .select()
      .from(chapters)
      .where(eq(chapters.storySlug, storySlug))
      .all();

    const chapterNumber = existingChapters.length + 1;

    console.log(`📊 Found ${existingChapters.length} existing chapters, creating chapter ${chapterNumber}`);

    // Insert chapter
    const insertResult = await db
      .insert(chapters)
      .values({
        storySlug,
        chapterNumber,
        createdAt: new Date().toISOString(),
      })
      .returning();

    const newChapter = insertResult[0];

    console.log(`📚 Created chapter ${chapterNumber} with ID: ${newChapter.id}`);

    // Upload images and create chapter pages
    const imageUrls = await uploadChapterImages(imageFiles, storySlug, chapterNumber);

    // Insert chapter pages
    const pagesToInsert = imageUrls.map((url, index) => ({
      chapterId: newChapter.id,
      imageUrl: url,
      pageNumber: index + 1,
    }));

    await db.insert(chapterPages).values(pagesToInsert);

    console.log(`📄 Created ${pagesToInsert.length} pages for chapter ${chapterNumber}`);

    // Invalidate cache for this story
    revalidateTag(`story-${storySlug}`, {});
    revalidateTag('stories', {});
    console.log(`🔄 Cache invalidated for story: ${storySlug}`);

    return {
      success: true,
      message: `Đã đăng chương ${chapterNumber} thành công với ${imageUrls.length} trang!`,
    };
  } catch (error) {
    console.error('❌ Create chapter error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng chương',
    };
  }
}
