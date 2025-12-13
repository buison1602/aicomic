'use server'

import { unstable_cache } from 'next/cache'
import { getDb } from '@/db'
import { stories } from '@/db/schema'

// Reverse mapping: Vietnamese → English
const genreVnToEn: Record<string, string> = {
  "Hành động": "Action",
  "Phiêu lưu": "Adventure",
  "Hài hước": "Comedy",
  "Chính kịch": "Drama",
  "Kỳ ảo": "Fantasy",
  "Kinh dị": "Horror",
  "Bí ẩn": "Mystery",
  "Lãng mạn": "Romance",
  "Khoa học viễn tưởng": "Sci-Fi",
  "Đời thường": "Slice of Life",
  "Thể thao": "Sports",
  "Siêu nhiên": "Supernatural",
  "Giả tưởng": "Fantasy", // Alternative spelling
}

async function fetchStoriesFromDb() {
  const db = getDb()
  
  // Fetch all stories from database
  const allStories = await db
    .select()
    .from(stories)
    .all()

  return allStories.map((story) => {
    // Parse genres and convert Vietnamese → English
    const genresVn = story.genres ? story.genres.split(',').map(g => g.trim()) : []
    const genresEn = genresVn.map(vn => genreVnToEn[vn] || vn) // Convert or keep original if not found
    
    return {
      id: story.id,
      title: story.title,
      slug: story.slug,
      thumbnailUrl: story.thumbnailUrl,
      author: story.author,
      description: story.description,
      genres: genresEn, // Now in English
      status: story.status,
      createdAt: story.createdAt,
    }
  })
}

// Cached version with tag for revalidation
const getCachedStories = unstable_cache(
  fetchStoriesFromDb,
  ['all-stories'],
  {
    tags: ['stories'],
    revalidate: 3600, // Revalidate every 1 hour
  }
)

export async function getAllStories() {
  try {
    const storiesData = await getCachedStories()
    
    console.log('📦 [Cache] Fetched stories (cached)')
    
    return {
      success: true,
      stories: storiesData,
    }
  } catch (error) {
    console.error('❌ Fetch stories error:', error)
    return {
      success: false,
      stories: [],
    }
  }
}
