"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BookOpen, TrendingUp, Clock, Star, Eye, Flame, Award, ChevronLeft, ChevronRight } from "lucide-react"
import { SectionCarousel } from "@/components/section-carousel"
import {
  TrendingCard,
  FeaturedCard,
  NewUpdatesCard,
  RecommendedCard,
  EditorChoiceCard,
} from "@/components/comic-cards"
import { getRandomStories, getRecentlyUpdatedStories, getTopStories } from "./actions"

// Types for stories from database
type Story = {
  id: number;
  slug: string;
  title: string;
  author: string | null;
  thumbnailUrl: string | null;
  genres: string | null;
  status: string | null;
  chapterCount: number;
};

// Hero carousel slides - keeping static for now
const heroSlides = [
  {
    id: 1,
    title: "Thiên Ma Quỷ Hoàn",
    description: "Hành trình báo thù đầy máu và nước mắt của một thiên tài võ học",
    slug: "thien-ma-quy-hoan",
    coverImage: "/images/daicongtu.jfif",
  },
  {
    id: 2,
    title: "One Piece",
    description: "Cuộc phiêu lưu tìm kiếm kho báu huyền thoại trên biển cả",
    slug: "one-piece",
    coverImage: "/images/daicongtu.jfif",
  },
  {
    id: 3,
    title: "Naruto",
    description: "Ninja trẻ với ước mơ trở thành Hokage vĩ đại nhất",
    slug: "naruto",
    coverImage: "/images/daicongtu.jfif",
  },
]

const genres = [
  "Hành động",
  "Lãng mạn",
  "Hài hước",
  "Kinh dị",
  "Phiêu lưu",
  "Giả tưởng",
  "Học đường",
  "Drama",
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeTab, setActiveTab] = useState<"day" | "week" | "month">("day")
  
  // State for stories from database
  const [featuredComics, setFeaturedComics] = useState<Story[]>([])
  const [newUpdates, setNewUpdates] = useState<Story[]>([])
  const [topTrending, setTopTrending] = useState<Story[]>([])
  const [topComics, setTopComics] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch stories from database
  useEffect(() => {
    async function fetchStories() {
      setIsLoading(true)
      
      const [featuredResult, recentResult, topResult, top10Result] = await Promise.all([
        getRandomStories(12), // Featured comics
        getRecentlyUpdatedStories(12), // New updates
        getTopStories(4), // Top trending
        getTopStories(10), // Top comics list
      ])

      if (featuredResult.success) setFeaturedComics(featuredResult.stories)
      if (recentResult.success) setNewUpdates(recentResult.stories)
      if (topResult.success) setTopTrending(topResult.stories)
      if (top10Result.success) setTopComics(top10Result.stories)
      
      setIsLoading(false)
    }
    
    fetchStories()
  }, [])

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Container with Portal Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Portal Grid: 70/30 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
          
          {/* LEFT CONTENT AREA (70%) */}
          <div className="space-y-6 overflow-hidden">
            
            {/* Hero Carousel Section */}
            <section className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
              <div className="relative h-[450px] group">
                {/* Slides */}
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                      <Image
                        src={slide.coverImage}
                        alt={slide.title}
                        fill
                        priority={index === 0}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="max-w-2xl px-8 md:px-12 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/90 rounded-full">
                          <Flame className="w-4 h-4 text-white" />
                          <span className="text-xs font-medium text-white">HOT</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                          {slide.title}
                        </h2>
                        
                        <p className="text-base md:text-lg text-white/90 leading-relaxed">
                          {slide.description}
                        </p>

                        <div className="flex items-center gap-4 pt-2">
                          <Link href={`/truyen/${slide.slug}`}>
                            <Button 
                              size="lg" 
                              className="bg-primary text-primary-foreground rounded-lg px-8 
                                transition-colors duration-200 cursor-pointer hover:opacity-90"
                            >
                              <BookOpen className="w-5 h-5 mr-2" />
                              Đọc ngay
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 
                    backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 
                    opacity-0 group-hover:opacity-100 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 
                    backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 
                    opacity-0 group-hover:opacity-100 cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        index === currentSlide 
                          ? "w-8 bg-white" 
                          : "w-2 bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Top Trending Section */}
            {isLoading ? (
              <div className="bg-card rounded-lg shadow-md border border-border p-6">
                <div className="text-center py-12 text-muted-foreground">Đang tải top trending...</div>
              </div>
            ) : (
              <SectionCarousel
                title="Top Trending"
                icon={TrendingUp}
                items={topTrending}
                renderCard={(comic, index) => <TrendingCard comic={comic} rank={index + 1} />}
                cardWidth="160px"
                gap="gap-3"
              />
            )}

            {/* Featured Tags Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Thể loại nổi bật
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Action Tag */}
                <Link
                  href="/danh-sach?genre=Hành động"
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg 
                    border border-border transition-all duration-300 cursor-pointer h-40"
                  style={{
                    background: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)"
                  }}
                >
                  {/* Background Icon */}
                  <div className="absolute -right-8 -bottom-8 opacity-10 transform rotate-12">
                    <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        HÀNH ĐỘNG
                      </h3>
                      <p className="text-sm text-gray-600">
                        150+ truyện
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 group-hover:text-primary 
                      transition-colors duration-200">
                      <span className="text-sm font-medium">Xem tất cả</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform 
                        duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>

                {/* Romance Tag */}
                <Link
                  href="/danh-sach?genre=Lãng mạn"
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg 
                    border border-border transition-all duration-300 cursor-pointer h-40"
                  style={{
                    background: "linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)"
                  }}
                >
                  {/* Background Icon */}
                  <div className="absolute -right-8 -bottom-8 opacity-10">
                    <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        LÃNG MẠN
                      </h3>
                      <p className="text-sm text-gray-600">
                        200+ truyện
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 group-hover:text-primary 
                      transition-colors duration-200">
                      <span className="text-sm font-medium">Xem tất cả</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform 
                        duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>

                {/* Fantasy Tag */}
                <Link
                  href="/danh-sach?genre=Giả tưởng"
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg 
                    border border-border transition-all duration-300 cursor-pointer h-40"
                  style={{
                    background: "linear-gradient(135deg, #E9D5FF 0%, #D8B4FE 100%)"
                  }}
                >
                  {/* Background Icon */}
                  <div className="absolute -right-8 -bottom-8 opacity-10 transform -rotate-12">
                    <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        GIẢ TƯỞNG
                      </h3>
                      <p className="text-sm text-gray-600">
                        180+ truyện
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 group-hover:text-primary 
                      transition-colors duration-200">
                      <span className="text-sm font-medium">Xem tất cả</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform 
                        duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>

                {/* Horror Tag */}
                <Link
                  href="/danh-sach?genre=Kinh dị"
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg 
                    border border-border transition-all duration-300 cursor-pointer h-40"
                  style={{
                    background: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)"
                  }}
                >
                  {/* Background Icon */}
                  <div className="absolute -right-8 -bottom-8 opacity-10">
                    <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        KINH DỊ
                      </h3>
                      <p className="text-sm text-gray-600">
                        90+ truyện
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 group-hover:text-primary 
                      transition-colors duration-200">
                      <span className="text-sm font-medium">Xem tất cả</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform 
                        duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {/* Featured Comics Section */}
            <SectionCarousel
              title="Truyện nổi bật"
              icon={TrendingUp}
              items={featuredComics}
              renderCard={(comic) => <FeaturedCard comic={comic} />}
              cardWidth="160px"
              gap="gap-3"
            />

            {/* New Updates Section */}
            <SectionCarousel
              title="Mới cập nhật"
              icon={Clock}
              items={newUpdates}
              viewAllLink="/danh-sach"
              renderCard={(comic) => <NewUpdatesCard comic={comic} />}
              cardWidth="160px"
              gap="gap-3"
            />

            {/* Recommended Section */}
            <SectionCarousel
              title="Đề xuất cho bạn"
              icon={Star}
              items={featuredComics.slice(0, 8)}
              renderCard={(comic) => <RecommendedCard comic={comic} />}
              cardWidth="160px"
              gap="gap-4"
              className="space-y-6"
            />

            {/* Editors' Choice Section */}
            <SectionCarousel
              title="Lựa chọn của biên tập viên"
              icon={Award}
              items={featuredComics.slice(0, 8)}
              renderCard={(comic) => <EditorChoiceCard comic={comic} />}
              cardWidth="160px"
              gap="gap-4"
              className="space-y-6"
            />

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
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
              <span className="text-muted-foreground px-2">...</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="rounded-lg transition-colors duration-200 cursor-pointer hover:bg-secondary"
              >
                50
              </Button>
            </div>

          </div>

          {/* RIGHT SIDEBAR (30%) */}
          <aside className="space-y-6">
            
            {/* Top Followed Ranking with Tabs */}
            <section className="bg-card rounded-lg shadow-md border border-border overflow-hidden sticky top-4">
              {/* Header */}
              <div className="p-6 pb-0">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Top theo dõi
                </h2>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center border-b border-border px-6 mt-4">
                <button
                  onClick={() => setActiveTab("day")}
                  className={`px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer
                    border-b-2 -mb-px ${
                      activeTab === "day"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Ngày
                </button>
                <button
                  onClick={() => setActiveTab("week")}
                  className={`px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer
                    border-b-2 -mb-px ${
                      activeTab === "week"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Tuần
                </button>
                <button
                  onClick={() => setActiveTab("month")}
                  className={`px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer
                    border-b-2 -mb-px ${
                      activeTab === "month"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Tháng
                </button>
              </div>

              {/* Ranking List */}
              <div className="p-4">
                {topComics.map((comic, index) => (
                  <Link
                    key={comic.id}
                    href={`/truyen/${comic.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 
                      transition-colors duration-200 cursor-pointer group border-b border-border 
                      last:border-b-0"
                  >
                    {/* Circular Rank Badge */}
                    <div
                      className={`w-8 h-8 flex-shrink-0 flex items-center justify-center 
                        rounded-full font-bold text-sm ${
                          index === 0
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-md"
                            : index === 1
                              ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md"
                              : index === 2
                                ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md"
                                : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {index + 1}
                    </div>

                    {/* Small Thumbnail */}
                    <div className="relative w-10 h-14 flex-shrink-0 overflow-hidden rounded bg-muted">
                      <Image
                        src={comic.thumbnailUrl || "/placeholder.svg"}
                        alt={comic.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>

                    {/* Comic Title */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-snug
                        group-hover:text-primary transition-colors duration-200">
                        {comic.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Genre Quick Links */}
            <section className="bg-card rounded-lg shadow-md border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Thể loại
              </h2>

              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/danh-sach?genre=${encodeURIComponent(genre)}`}
                    className="px-4 py-2 text-sm bg-muted hover:bg-primary hover:text-primary-foreground
                      rounded-lg transition-colors duration-200 cursor-pointer font-medium"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </section>

          </aside>

        </div>
      </div>
    </div>
  )
}
