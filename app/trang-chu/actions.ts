'use server';

import { getDb } from '@/db';
import { stories, chapters } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function getRandomStories(limit: number = 12) {
  try {
    const db = getDb();

    // Get random stories with chapter count
    const result = await db
      .select()
      .from(stories)
      .leftJoin(chapters, sql`${stories.slug} = ${chapters.storySlug}`)
      .groupBy(stories.id)
      .orderBy(sql`RANDOM()`)
      .limit(limit)
      .all();

    // Map to flat structure with chapter count
    const uniqueStories = new Map();
    
    result.forEach(row => {
      const storySlug = row.stories.slug;
      if (!uniqueStories.has(storySlug)) {
        uniqueStories.set(storySlug, {
          id: row.stories.id,
          slug: row.stories.slug,
          title: row.stories.title,
          author: row.stories.author,
          thumbnailUrl: row.stories.thumbnailUrl,
          genres: row.stories.genres,
          status: row.stories.status,
          chapterCount: 0,
        });
      }
      
      if (row.chapters) {
        uniqueStories.get(storySlug).chapterCount++;
      }
    });

    return {
      success: true,
      stories: Array.from(uniqueStories.values()).slice(0, limit),
    };
  } catch (error) {
    console.error('❌ Get random stories error:', error);
    return {
      success: false,
      stories: [],
    };
  }
}

export async function getRecentlyUpdatedStories(limit: number = 12) {
  try {
    const db = getDb();

    // Get stories with latest chapter update
    const result = await db
      .select()
      .from(stories)
      .leftJoin(chapters, sql`${stories.slug} = ${chapters.storySlug}`)
      .groupBy(stories.id)
      .orderBy(sql`MAX(${chapters.createdAt}) DESC`)
      .limit(limit)
      .all();

    // Map and calculate chapter count
    const storiesMap = new Map();
    
    result.forEach(row => {
      const storySlug = row.stories.slug;
      if (!storiesMap.has(storySlug)) {
        storiesMap.set(storySlug, {
          id: row.stories.id,
          slug: row.stories.slug,
          title: row.stories.title,
          author: row.stories.author,
          thumbnailUrl: row.stories.thumbnailUrl,
          genres: row.stories.genres,
          status: row.stories.status,
          chapterCount: 0,
          latestUpdate: row.chapters?.createdAt || row.stories.createdAt,
        });
      }
      
      if (row.chapters) {
        storiesMap.get(storySlug).chapterCount++;
      }
    });

    return {
      success: true,
      stories: Array.from(storiesMap.values()).slice(0, limit),
    };
  } catch (error) {
    console.error('❌ Get recently updated stories error:', error);
    return {
      success: false,
      stories: [],
    };
  }
}

export async function getTopStories(limit: number = 4) {
  try {
    const db = getDb();

    // Get stories ordered by chapter count (as proxy for popularity)
    const result = await db
      .select()
      .from(stories)
      .leftJoin(chapters, sql`${stories.slug} = ${chapters.storySlug}`)
      .groupBy(stories.id)
      .orderBy(sql`COUNT(${chapters.id}) DESC, ${stories.createdAt} DESC`)
      .limit(limit)
      .all();

    // Map and count chapters
    const storiesMap = new Map();
    
    result.forEach(row => {
      const storySlug = row.stories.slug;
      if (!storiesMap.has(storySlug)) {
        storiesMap.set(storySlug, {
          id: row.stories.id,
          slug: row.stories.slug,
          title: row.stories.title,
          author: row.stories.author,
          thumbnailUrl: row.stories.thumbnailUrl,
          genres: row.stories.genres,
          status: row.stories.status,
          chapterCount: 0,
        });
      }
      
      if (row.chapters) {
        storiesMap.get(storySlug).chapterCount++;
      }
    });

    return {
      success: true,
      stories: Array.from(storiesMap.values()).slice(0, limit),
    };
  } catch (error) {
    console.error('❌ Get top stories error:', error);
    return {
      success: false,
      stories: [],
    };
  }
}
