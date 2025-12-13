import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, User, CheckCircle2, Tag } from "lucide-react"
import { getStoryBySlug } from "./actions"

export const runtime = 'edge';

import { notFound } from "next/navigation"

interface ComicPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ComicDetailPage({ params }: ComicPageProps) {
  const { slug } = await params
  
  // Fetch story data from database
  const { success, story, chapters } = await getStoryBySlug(slug)

  if (!success || !story) {
    notFound()
  }

  // Parse genres from string to array
  const genres = story.genres ? story.genres.split(",").map(g => g.trim()) : []

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Comic Cover */}
        <div>
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={story.thumbnailUrl || "/placeholder.svg"}
              alt={story.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Comic Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{story.title}</h1>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tác giả:</span>
                <span className="font-medium">{story.author || "Đang cập nhật"}</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Trạng thái:</span>
                <span className="font-medium text-green-600">{story.status || "Đang cập nhật"}</span>
              </div>

              {genres.length > 0 && (
                <div className="flex items-start gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">Thể loại:</span>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre, index) => (
                      <span key={index} className="px-2 py-1 bg-muted rounded text-xs font-medium">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {story.description && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Mô tả</h2>
              <p className="text-muted-foreground leading-relaxed">
                {story.description}
              </p>
            </div>
          )}

          <div>
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href={`/truyen/${slug}/1`}>
                <BookOpen className="mr-2 h-5 w-5" />
                Đọc từ đầu
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Danh sách chương ({chapters.length} chương)</h2>
        {chapters.length > 0 ? (
          <Card>
            <CardContent className="p-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {chapters.map((chapter, index) => (
                  <Link
                    key={chapter.id}
                    href={`/truyen/${slug}/${index + 1}`}
                    className="p-3 hover:bg-muted rounded-md transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium group-hover:text-primary transition-colors">
                      Chương {index + 1}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Chưa có chương nào
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
