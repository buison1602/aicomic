import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BookOpen, TrendingUp, Clock } from "lucide-react"

// Generate 30 comic cards (5 rows x 6 columns)
const comics = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: i === 0 ? "Thiên Ma Quỷ Hoàn" : `Comic Title ${i + 1}`,
  slug: i === 0 ? "thien-ma-quy-hoan" : `comic-${i + 1}`,
  coverImage: "/images/daicongtu.jfif",
  latestChapters: [
    {
      number: 25 - i,
      timestamp:
        i % 5 === 0
          ? "0 phút trước"
          : i % 5 === 1
            ? "5 phút trước"
            : i % 5 === 2
              ? "6 giờ trước"
              : i % 5 === 3
                ? "24-11-2025"
                : "23-11-2025",
    },
    {
      number: 24 - i,
      timestamp: i % 4 === 0 ? "1 giờ trước" : i % 4 === 1 ? "3 giờ trước" : i % 4 === 2 ? "23-11-2025" : "22-11-2025",
    },
  ],
}))

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section - Minimalist & Clean */}
      <section className="relative py-20 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Hero Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
              Khám phá thế giới truyện tranh
            </h1>
            
            {/* Hero Description */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Hàng ngàn đầu truyện đa dạng thể loại, cập nhật mỗi ngày. 
              Đọc miễn phí, không giới hạn.
            </p>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/danh-sach">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground rounded-lg px-8 py-6 text-base font-medium 
                    transition-colors duration-200 cursor-pointer hover:opacity-90"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Khám phá ngay
                </Button>
              </Link>
              <Link href="/danh-sach">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="rounded-lg px-8 py-6 text-base font-medium transition-colors duration-200 cursor-pointer"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Truyện hot
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Comics Section - Bento Grid Layout */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Truyện đang hot
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Những bộ truyện được yêu thích và cập nhật liên tục
            </p>
          </div>

          {/* Bento Grid - Responsive Comic Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {comics.map((comic) => (
              <Link 
                key={comic.id} 
                href={`/truyen/${comic.slug}`}
                className="group cursor-pointer"
              >
                {/* Comic Card - Clean & Minimal */}
                <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-smooth overflow-hidden">
                  {/* Cover Image */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                    <Image
                      src={comic.coverImage || "/placeholder.svg"}
                      alt={comic.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    {/* Title */}
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug 
                      group-hover:text-primary transition-colors duration-200 min-h-[2.5rem]">
                      {comic.title}
                    </h3>

                    {/* Latest Chapters */}
                    <div className="space-y-2 text-xs text-muted-foreground">
                      {/* Chapter 1 */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium">Ch. {comic.latestChapters[0].number}</span>
                        <span className="flex items-center gap-1 text-[10px] opacity-70">
                          <Clock className="w-3 h-3" />
                          {comic.latestChapters[0].timestamp}
                        </span>
                      </div>

                      {/* Chapter 2 */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium">Ch. {comic.latestChapters[1].number}</span>
                        <span className="flex items-center gap-1 text-[10px] opacity-70">
                          <Clock className="w-3 h-3" />
                          {comic.latestChapters[1].timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-primary text-primary-foreground hover:opacity-90 rounded-lg 
                transition-colors duration-200 cursor-pointer"
            >
              1
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="rounded-lg transition-colors duration-200 cursor-pointer hover:bg-secondary"
            >
              2
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="rounded-lg transition-colors duration-200 cursor-pointer hover:bg-secondary"
            >
              3
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="rounded-lg transition-colors duration-200 cursor-pointer hover:bg-secondary"
            >
              4
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="rounded-lg transition-colors duration-200 cursor-pointer hover:bg-secondary"
            >
              5
            </Button>
            <span className="text-muted-foreground px-2">...</span>
            <Button 
              variant="ghost" 
              size="sm"
              className="rounded-lg transition-colors duration-200 cursor-pointer hover:bg-secondary"
            >
              100
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
