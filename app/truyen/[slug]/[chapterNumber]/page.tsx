'use client';

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import ChapterReader from "./ChapterReader"

// BẮT BUỘC cho dynamic route trên Cloudflare Pages
export const runtime = 'edge';

export default function ChapterReadingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const chapterNumber = params.chapterNumber as string;
  const chapterNum = parseInt(chapterNumber);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchChapter() {
      try {
        const response = await fetch(`/api/truyen/${slug}/${chapterNumber}`);
        if (!response.ok) {
          setError(true);
          return;
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching chapter:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchChapter();
  }, [slug, chapterNumber]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  if (error || !data) {
    return <div className="flex items-center justify-center min-h-screen">Không tìm thấy chương</div>;
  }

  return <ChapterReader slug={slug} chapterNum={chapterNum} chapter={data.chapter} pages={data.pages} totalChapters={data.totalChapters} />
}
