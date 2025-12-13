'use server';

import { revalidateTag } from 'next/cache';
import { getDb } from '@/db';
import { stories, chapters, users } from '@/db/schema';
import { toSlug } from '@/lib/utils';
import { uploadToR2, generateThumbnailKey } from '@/lib/r2-upload';
import { eq, sql } from 'drizzle-orm';
import { auth } from '@/auth';

export async function createStory(formData: FormData) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        success: false,
        message: 'Bạn cần đăng nhập để đăng truyện',
        slug: null,
      };
    }

    const db = getDb();

    // Ensure user exists in database (check by email, not ID)
    let userId = session.user.id;
    
    if (session.user.email) {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email))
        .limit(1);

      if (existingUser.length === 0) {
        // Create user if doesn't exist
        await db.insert(users).values({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name || null,
          image: session.user.image || null,
          emailVerified: null,
        });
        console.log(`✅ Auto-created user in DB: ${session.user.email}`);
      } else {
        // Use the existing user's ID from database
        userId = existingUser[0].id;
      }
    }

    // Extract form data
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const status = formData.get('status') as string;
    const genres = formData.get('genres') as string;
    const description = formData.get('description') as string;
    const thumbnailFile = formData.get('thumbnail') as File | null;

    // Validate required fields
    if (!title || !author || !status || !genres) {
      return {
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        slug: null,
      };
    }

    // Validate thumbnail file
    if (!thumbnailFile || thumbnailFile.size === 0) {
      return {
        success: false,
        message: 'Vui lòng chọn ảnh đại diện truyện',
        slug: null,
      };
    }

    // Generate slug from title
    const slug = toSlug(title);

    // Check if slug already exists
    const existingStory = await db.select().from(stories).where(eq(stories.slug, slug)).limit(1);

    if (existingStory.length > 0) {
      return {
        success: false,
        message: `Truyện với tên "${title}" đã tồn tại. Vui lòng chọn tên khác.`,
        slug: null,
      };
    }

    // Upload thumbnail to R2 (or simulate in dev mode)
    const thumbnailKey = generateThumbnailKey(slug, thumbnailFile.name);
    const thumbnailUrl = await uploadToR2(thumbnailFile, thumbnailKey);

    console.log(`📸 Thumbnail URL: ${thumbnailUrl}`);

    // Insert new story with creatorId (use userId from database lookup)
    await db.insert(stories).values({
      slug,
      title,
      author,
      status,
      genres,
      description: description || null,
      thumbnailUrl,
      creatorId: userId,
      createdAt: new Date().toISOString(),
    });

    // Invalidate cache for stories list
    revalidateTag('stories', {});
    console.log(`🔄 Cache invalidated for stories list`);

    return {
      success: true,
      message: `Đã đăng truyện "${title}" thành công!`,
      slug,
    };
  } catch (error) {
    console.error('❌ Create story error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng truyện',
      slug: null,
    };
  }
}

export async function getUserStories() {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user?.id || !session.user?.email) {
      return {
        success: false,
        stories: [],
      };
    }

    const db = getDb();

    // Get user's ID from database (by email)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (existingUser.length === 0) {
      return {
        success: false,
        stories: [],
      };
    }

    const userId = existingUser[0].id;

    // Fetch only current user's stories with chapter count
    const result = await db
      .select()
      .from(stories)
      .leftJoin(chapters, eq(stories.slug, chapters.storySlug))
      .where(eq(stories.creatorId, userId))
      .groupBy(stories.id)
      .orderBy(sql`${stories.createdAt} DESC`)
      .all();

    // Map to flat structure with chapter count
    const flatResult = result.map((row: any) => ({
      id: row.stories.id,
      slug: row.stories.slug,
      title: row.stories.title,
      thumbnailUrl: row.stories.thumbnailUrl,
      createdAt: row.stories.createdAt,
      chapterCount: result.filter((r: any) => r.stories.id === row.stories.id && r.chapters !== null).length,
    }));

    // Remove duplicates and count chapters properly
    const uniqueStories = Array.from(
      new Map(flatResult.map((story: any) => [story.id, story])).values()
    );

    // Recalculate chapter count for each unique story
    const storiesWithCount = uniqueStories.map((story: any) => {
      const chapterCount = result.filter(
        (r: any) => r.stories.id === story.id && r.chapters !== null
      ).length;
      return { ...story, chapterCount };
    });

    return {
      success: true,
      stories: storiesWithCount,
    };
  } catch (error) {
    console.error('❌ Fetch stories error:', error);
    return {
      success: false,
      stories: [],
    };
  }
}
