"use server"

import { unstable_cache } from 'next/cache'
import { getDb } from "@/db"
import { chapterPages } from "@/db/schema"
import { eq } from "drizzle-orm"

async function fetchChapterPages(slug: string, chapterIndex: number) {
  const db = getDb()

  // Get all chapters for this story, sorted by chapter_number
  const allChapters = (db as any).$client.prepare(
    'SELECT * FROM chapters WHERE story_slug = ? ORDER BY chapter_number'
  ).all(slug) as any[]

  console.log(`📊 Found ${allChapters.length} chapters total`)

  // Get chapter by index (chapterIndex is 1-based, so subtract 1 for 0-based array)
  const chapterResult = allChapters[chapterIndex - 1]

  console.log('📚 Chapter at index', chapterIndex, ':', chapterResult)

  if (!chapterResult) {
    console.log('❌ Chapter not found at index', chapterIndex)
    return null
  }

  // Get all pages for this chapter using Drizzle
  const pages = await db
    .select()
    .from(chapterPages)
    .where(eq(chapterPages.chapterId, chapterResult.id))
    .orderBy(chapterPages.pageNumber)
    .all()

  console.log('📄 Pages found:', pages.length)

  return {
    chapter: {
      id: chapterResult.id,
      chapterNumber: chapterResult.chapter_number,
    },
    pages: pages.map((page: any) => ({
      id: page.id,
      pageNumber: page.pageNumber,
      imageUrl: page.imageUrl,
    })),
    totalChapters: allChapters.length,
  }
}

// Cached version with dynamic tag per chapter
const getCachedChapter = (slug: string, chapterIndex: number) =>
  unstable_cache(
    () => fetchChapterPages(slug, chapterIndex),
    [`chapter-${slug}-${chapterIndex}`],
    {
      tags: [`story-${slug}`, `chapter-${slug}-${chapterIndex}`],
      revalidate: 3600,
    }
  )

export async function getChapterPages(slug: string, chapterIndex: number) {
  try {
    console.log('🔍 getChapterPages called with:', { slug, chapterIndex, type: typeof chapterIndex })
    console.log('📦 [Cache] Fetching chapter (cached)')
    
    const data = await getCachedChapter(slug, chapterIndex)()

    if (!data) {
      return { success: false, chapter: null, pages: [], totalChapters: 0 }
    }

    return {
      success: true,
      chapter: data.chapter,
      pages: data.pages,
      totalChapters: data.totalChapters,
    }
  } catch (error) {
    console.error("Error fetching chapter pages:", error)
    return { success: false, chapter: null, pages: [], totalChapters: 0 }
  }
}
