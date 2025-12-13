"use server"

import { unstable_cache } from 'next/cache'
import { getDb } from "@/db"
import { stories, chapters } from "@/db/schema"
import { eq } from "drizzle-orm"

async function fetchStoryBySlug(slug: string) {
  const db = getDb()

  // Get story with chapters
  const storyResult = await db
    .select()
    .from(stories)
    .where(eq(stories.slug, slug))
    .limit(1)
    .all()

  if (storyResult.length === 0) {
    return null
  }

  const story = storyResult[0]

  // Get all chapters for this story
  const storyChapters = await db
    .select()
    .from(chapters)
    .where(eq(chapters.storySlug, story.slug))
    .orderBy(chapters.chapterNumber)
    .all()

  return {
    story: {
      id: story.id,
      title: story.title,
      slug: story.slug,
      author: story.author,
      description: story.description,
      thumbnailUrl: story.thumbnailUrl,
      genres: story.genres,
      status: story.status,
    },
    chapters: storyChapters.map((ch: any) => ({
      id: ch.id,
      chapterNumber: ch.chapterNumber,
    })),
  }
}

// Cached version with dynamic tag per story
const getCachedStory = (slug: string) =>
  unstable_cache(
    () => fetchStoryBySlug(slug),
    [`story-${slug}`],
    {
      tags: [`story-${slug}`, 'stories'],
      revalidate: 3600,
    }
  )

export async function getStoryBySlug(slug: string) {
  try {
    console.log(`📦 [Cache] Fetching story: ${slug}`)
    
    const data = await getCachedStory(slug)()

    if (!data) {
      return { success: false, story: null, chapters: [] }
    }

    return {
      success: true,
      story: data.story,
      chapters: data.chapters,
    }
  } catch (error) {
    console.error("Error fetching story:", error)
    return { success: false, story: null, chapters: [] }
  }
}
