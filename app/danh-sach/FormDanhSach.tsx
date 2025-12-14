"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Filter, X, Clock, ChevronDown } from "lucide-react"
import { getAllStories } from "./actions"

// Story type
interface Story {
  id: number
  title: string
  slug: string
  thumbnailUrl: string | null
  author: string | null
  description: string | null
  genres: string[]
  status: string | null
  createdAt: string | null
}

// Genre translation mapping
const genreTranslations: Record<string, string> = {
  "Action": "Hành động",
  "Adventure": "Phiêu lưu",
  "Comedy": "Hài hước",
  "Drama": "Chính kịch",
  "Fantasy": "Kỳ ảo",
  "Horror": "Kinh dị",
  "Mystery": "Bí ẩn",
  "Romance": "Lãng mạn",
  "Sci-Fi": "Khoa học viễn tưởng",
  "Slice of Life": "Đời thường",
  "Sports": "Thể thao",
  "Supernatural": "Siêu nhiên",
}

// Filter categories (Vietnamese labels, English values for DB compatibility)
const genres = [
  { value: "Action", label: "Hành động" },
  { value: "Adventure", label: "Phiêu lưu" },
  { value: "Comedy", label: "Hài hước" },
  { value: "Drama", label: "Chính kịch" },
  { value: "Fantasy", label: "Kỳ ảo" },
  { value: "Horror", label: "Kinh dị" },
  { value: "Mystery", label: "Bí ẩn" },
  { value: "Romance", label: "Lãng mạn" },
  { value: "Sci-Fi", label: "Khoa học viễn tưởng" },
  { value: "Slice of Life", label: "Đời thường" },
  { value: "Sports", label: "Thể thao" },
  { value: "Supernatural", label: "Siêu nhiên" },
]

const statuses = [
  { value: "ongoing", label: "Đang tiến hành" },
  { value: "completed", label: "Hoàn thành" },
  { value: "hiatus", label: "Tạm dừng" },
]

const sortOptions = [
  { value: "latest", label: "Mới cập nhật" },
  { value: "popular", label: "Phổ biến" },
  { value: "name", label: "Tên A-Z" },
]

export default function DanhSachPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("latest")
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch stories on mount
  useEffect(() => {
    async function fetchStories() {
      setIsLoading(true)
      const result = await getAllStories()
      if (result.success) {
        setStories(result.stories)
      }
      setIsLoading(false)
    }
    fetchStories()
  }, [])

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedStatus([])
  }

  // Filter and sort stories
  const filteredStories = stories.filter((story) => {
    // Filter by genres
    if (selectedGenres.length > 0) {
      const hasMatchingGenre = selectedGenres.some((selectedGenre) =>
        story.genres.includes(selectedGenre)
      )
      if (!hasMatchingGenre) return false
    }

    // Filter by status
    if (selectedStatus.length > 0) {
      if (!story.status || !selectedStatus.includes(story.status)) return false
    }

    return true
  })

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center py-12 text-muted-foreground">
            Đang tải danh sách truyện...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Danh sách truyện
          </h1>
          <p className="text-base text-muted-foreground">
            Khám phá hàng ngàn bộ truyện đa dạng thể loại
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Bộ lọc
                </h2>
                {(selectedGenres.length > 0 || selectedStatus.length > 0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs cursor-pointer hover:bg-secondary rounded-lg transition-colors duration-200"
                  >
                    Xóa tất cả
                  </Button>
                )}
              </div>

              {/* Sort By */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Sắp xếp</h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-4 h-4 text-primary border-border cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Thể loại</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {genres.map((genre) => (
                    <label
                      key={genre.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre.value)}
                        onChange={() => toggleGenre(genre.value)}
                        className="w-4 h-4 text-primary border-border rounded cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        {genre.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Tình trạng</h3>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <label
                      key={status.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatus.includes(status.value)}
                        onChange={() => toggleStatus(status.value)}
                        className="w-4 h-4 text-primary border-border rounded cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        {status.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Button
              onClick={() => setSidebarOpen(true)}
              className="w-full bg-secondary text-secondary-foreground rounded-lg px-4 py-3 
                font-medium transition-colors duration-200 cursor-pointer hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Bộ lọc
              {(selectedGenres.length > 0 || selectedStatus.length > 0) && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {selectedGenres.length + selectedStatus.length}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
              <div
                className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background shadow-lg overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 space-y-6">
                  {/* Mobile Filter Header */}
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Bộ lọc
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(false)}
                      className="cursor-pointer hover:bg-secondary rounded-lg transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Clear Filters */}
                  {(selectedGenres.length > 0 || selectedStatus.length > 0) && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full cursor-pointer rounded-lg transition-colors duration-200"
                    >
                      Xóa tất cả
                    </Button>
                  )}

                  {/* Sort By - Mobile */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Sắp xếp</h3>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="sort-mobile"
                            value={option.value}
                            checked={sortBy === option.value}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-4 h-4 text-primary border-border cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Genre Filter - Mobile */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Thể loại</h3>
                    <div className="space-y-2">
                      {genres.map((genre) => (
                        <label
                          key={genre.value}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGenres.includes(genre.value)}
                            onChange={() => toggleGenre(genre.value)}
                            className="w-4 h-4 text-primary border-border rounded cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                            {genre.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter - Mobile */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Tình trạng</h3>
                    <div className="space-y-2">
                      {statuses.map((status) => (
                        <label
                          key={status.value}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatus.includes(status.value)}
                            onChange={() => toggleStatus(status.value)}
                            className="w-4 h-4 text-primary border-border rounded cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                            {status.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button - Mobile */}
                  <Button
                    onClick={() => setSidebarOpen(false)}
                    className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-3 
                      font-medium transition-colors duration-200 cursor-pointer hover:opacity-90"
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Active Filters Tags */}
            {(selectedGenres.length > 0 || selectedStatus.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground 
                      rounded-lg text-sm font-medium cursor-pointer hover:bg-accent/80 transition-colors duration-200"
                  >
                    {genreTranslations[genre] || genre}
                    <X className="w-3.5 h-3.5" />
                  </button>
                ))}
                {selectedStatus.map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground 
                      rounded-lg text-sm font-medium cursor-pointer hover:bg-accent/80 transition-colors duration-200"
                  >
                    {statuses.find(s => s.value === status)?.label || status}
                    <X className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            )}

            {/* Comics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredStories.length > 0 ? (
                filteredStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/truyen/${story.slug}`}
                  className="group cursor-pointer"
                >
                  {/* Story Card */}
                  <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-smooth overflow-hidden">
                    {/* Cover Image */}
                    <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                      <Image
                        src={story.thumbnailUrl || "/images/daicongtu.jfif"}
                        alt={story.title}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      {/* Title */}
                      <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug 
                        group-hover:text-primary transition-colors duration-200 min-h-[2.5rem]">
                        {story.title}
                      </h3>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-1">
                        {story.genres.slice(0, 2).map((genre) => (
                          <span 
                            key={genre}
                            className="px-2 py-0.5 text-[10px] bg-secondary text-secondary-foreground rounded"
                          >
                            {genreTranslations[genre] || genre}
                          </span>
                        ))}
                      </div>

                      {/* Status */}
                      {story.status && (
                        <div className="text-xs text-muted-foreground">
                          {statuses.find(s => s.value === story.status)?.label || story.status}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-muted-foreground text-lg">
                    Không tìm thấy truyện nào phù hợp với bộ lọc
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
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
          </main>
        </div>
      </div>
    </div>
  )
}
