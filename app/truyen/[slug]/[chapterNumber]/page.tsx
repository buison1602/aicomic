import { getChapterPages } from "./actions"
import { notFound } from "next/navigation"
import ChapterReader from "./ChapterReader"

interface ChapterPageProps {
  params: Promise<{
    slug: string
    chapterNumber: string
  }>
}

export default async function ChapterReadingPage({ params }: ChapterPageProps) {
  const resolvedParams = await params
  console.log('🎬 RAW params object:', resolvedParams)
  console.log('🎬 All params keys:', Object.keys(resolvedParams))
  
  const { slug, chapterNumber } = resolvedParams
  console.log('🎬 Extracted:', { slug, chapterNumber })
  
  // Parse the chapter number directly (now it's just a number string)
  const chapterNum = Number.parseInt(chapterNumber)
  console.log('🔢 Parsed chapterNum:', chapterNum)

  // Fetch chapter pages from database
  const { success, chapter, pages, totalChapters } = await getChapterPages(slug, chapterNum)

  console.log('✅ Result:', { success, hasChapter: !!chapter, pagesCount: pages.length, totalChapters })

  if (!success || !chapter) {
    console.log('⚠️ Calling notFound()')
    notFound()
  }

  return <ChapterReader slug={slug} chapterNum={chapterNum} chapter={chapter} pages={pages} totalChapters={totalChapters} />
}
