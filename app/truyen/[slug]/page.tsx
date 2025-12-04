import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, User, CheckCircle2, Tag } from "lucide-react"

// Generate chapters
const chapters = Array.from({ length: 50 }, (_, i) => ({
  number: i + 1,
  title: `Chương ${i + 1}`,
}))

interface ComicPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ComicDetailPage({ params }: ComicPageProps) {
  const { slug } = await params

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Comic Cover */}
        <div>
          <img src="/images/daicongtu.jfif" alt="Comic cover" className="w-full rounded-lg shadow-lg" />
        </div>

        {/* Comic Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">Thiên Ma Quỷ Hoàn</h1>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tác giả:</span>
                <span className="font-medium">John Doe</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Trạng thái:</span>
                <span className="font-medium text-green-600">Đang tiến hành</span>
              </div>

              <div className="flex items-start gap-2">
                <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">Thể loại:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted rounded text-xs font-medium">Hành động</span>
                  <span className="px-2 py-1 bg-muted rounded text-xs font-medium">Phiêu lưu</span>
                  <span className="px-2 py-1 bg-muted rounded text-xs font-medium">Kiếm hiệp</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Mô tả</h2>
            <p className="text-muted-foreground leading-relaxed">
              Một câu chuyện phiêu lưu kỳ thú về hành trình của một thiếu niên trong thế giới tu tiên đầy nguy hiểm. Với
              ý chí kiên cường và tài năng vượt trội, nhân vật chính phải đối mặt với vô số thử thách để trở thành người
              mạnh nhất. Cùng theo dõi hành trình đầy gian nan và cảm động này.
            </p>
          </div>

          <div>
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href={`/truyen/${slug}/chuong-1`}>
                <BookOpen className="mr-2 h-5 w-5" />
                Đọc từ đầu
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Danh sách chương</h2>
        <Card>
          <CardContent className="p-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.number}
                  href={`/truyen/${slug}/chuong-${chapter.number}`}
                  className="p-3 hover:bg-muted rounded-md transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">{chapter.title}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
