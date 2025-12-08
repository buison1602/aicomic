import Link from "next/link"
import Image from "next/image"
import { Star, Eye, Clock, Award } from "lucide-react"

// Trending Card with Rank Badge
export function TrendingCard({ comic }: { comic: any }) {
  return (
    <div className="flex-shrink-0 w-[160px] snap-start group">
      <div className="relative bg-card rounded-lg shadow-md hover:shadow-lg border border-border overflow-hidden transition-all duration-300">
        {/* Rank Badge - Top Left */}
        <div
          className="absolute top-1.5 left-1.5 z-20 w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm shadow-lg"
          style={{
            background:
              comic.rank === 1
                ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                : comic.rank === 2
                  ? "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
                  : comic.rank === 3
                    ? "linear-gradient(135deg, #fb923c 0%, #f97316 100%)"
                    : "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
            color: "white",
          }}
        >
          {comic.rank}
        </div>

        {/* Cover Image */}
        <Link href={`/truyen/${comic.slug}`} className="block cursor-pointer">
          <div className="aspect-[3/4] relative overflow-hidden bg-muted">
            <Image
              src={comic.coverImage || "/placeholder.svg"}
              alt={comic.title}
              fill
              sizes="160px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Card Content */}
        <div className="p-2.5 space-y-2">
          {/* Title */}
          <Link href={`/truyen/${comic.slug}`} className="cursor-pointer">
            <h3 className="font-semibold text-xs text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200 min-h-[2rem]">
              {comic.title}
            </h3>
          </Link>

          {/* Rating & Views */}
          <div className="flex items-center justify-between text-[10px]">
            {/* Star Rating */}
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{comic.rating}</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-0.5 text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span>{comic.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Featured Comic Card
export function FeaturedCard({ comic }: { comic: any }) {
  return (
    <div className="flex-shrink-0 w-[160px] snap-start bg-card rounded-lg shadow-md hover:shadow-lg border border-border overflow-hidden transition-all duration-300 group">
      {/* Cover Image */}
      <Link href={`/truyen/${comic.slug}`} className="block cursor-pointer">
        <div className="aspect-[3/4] relative overflow-hidden bg-muted">
          <Image
            src={comic.coverImage || "/placeholder.svg"}
            alt={comic.title}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-2.5 space-y-2">
        <Link href={`/truyen/${comic.slug}`} className="cursor-pointer">
          <h3 className="font-semibold text-xs text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200 min-h-[2rem]">
            {comic.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-[10px]">
          <span className="font-medium text-foreground">Ch. {comic.latestChapter}</span>
          <span className="text-muted-foreground">{comic.timestamp}</span>
        </div>
      </div>
    </div>
  )
}

// New Updates Card with Chapters
export function NewUpdatesCard({ comic }: { comic: any }) {
  return (
    <div className="flex-shrink-0 w-[160px] snap-start bg-card rounded-lg shadow-md hover:shadow-lg border border-border overflow-hidden transition-all duration-300 group">
      {/* Cover Image */}
      <Link href={`/truyen/${comic.slug}`} className="block cursor-pointer">
        <div className="aspect-[3/4] relative overflow-hidden bg-muted">
          <Image
            src={comic.coverImage || "/placeholder.svg"}
            alt={comic.title}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-2.5 space-y-2">
        {/* Title */}
        <Link href={`/truyen/${comic.slug}`} className="cursor-pointer">
          <h3 className="font-semibold text-xs text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200 min-h-[2rem]">
            {comic.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-2.5 h-2.5 ${
                star <= Math.floor(Number(comic.rating))
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-[10px] font-medium text-foreground ml-0.5">{comic.rating}</span>
        </div>

        {/* Chapter Links */}
        {comic.chapters && (
          <div className="pt-1.5 border-t border-border space-y-0.5">
            {comic.chapters.map((chapter: any, index: number) => (
              <Link
                key={index}
                href={`/truyen/${comic.slug}/chuong-${chapter.number}`}
                className="flex items-center justify-between text-[10px] hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                <span className="font-medium text-foreground truncate">Ch {chapter.number}</span>
                <span className="text-muted-foreground flex items-center gap-0.5 flex-shrink-0">
                  <Clock className="w-2.5 h-2.5" />
                  {chapter.timestamp}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Recommended Card
export function RecommendedCard({ comic }: { comic: any }) {
  return (
    <div className="flex-shrink-0 w-[160px] snap-start bg-card rounded-lg shadow-md hover:shadow-lg border border-border overflow-hidden transition-all duration-300 group">
      {/* Cover Image */}
      <Link href={`/truyen/${comic.slug}`} className="block cursor-pointer">
        <div className="aspect-[3/4] relative overflow-hidden bg-muted">
          <Image
            src={comic.coverImage || "/placeholder.svg"}
            alt={comic.title}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-2.5 space-y-2">
        <Link href={`/truyen/${comic.slug}`} className="cursor-pointer">
          <h3 className="font-semibold text-xs text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200 min-h-[2rem]">
            {comic.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-[10px]">
          <span className="font-medium text-foreground">Ch. {comic.latestChapter}</span>
          <span className="text-muted-foreground">{comic.timestamp}</span>
        </div>
      </div>
    </div>
  )
}

// Editor's Choice Card with Badge
export function EditorChoiceCard({ comic }: { comic: any }) {
  return (
    <div className="flex-shrink-0 w-[160px] snap-start bg-card rounded-lg shadow-md hover:shadow-lg border border-border overflow-hidden transition-all duration-300 group">
      {/* Cover Image */}
      <Link href={`/truyen/${comic.slug}`} className="block cursor-pointer">
        <div className="aspect-[3/4] relative overflow-hidden bg-muted">
          <Image
            src={comic.coverImage || "/placeholder.svg"}
            alt={comic.title}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Editor's Badge */}
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-primary/90 rounded-md flex items-center gap-0.5">
            <Award className="w-2.5 h-2.5 text-white" />
            <span className="text-[9px] font-medium text-white">Editor's Pick</span>
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-2.5 space-y-2">
        <Link href={`/truyen/${comic.slug}`} className="cursor-pointer">
          <h3 className="font-semibold text-xs text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200 min-h-[2rem]">
            {comic.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-[10px]">
          <span className="font-medium text-foreground">Ch. {comic.latestChapter}</span>
          <span className="text-muted-foreground flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
            {comic.timestamp}
          </span>
        </div>
      </div>
    </div>
  )
}
