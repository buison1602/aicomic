"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Filter, X, Clock, ChevronDown } from "lucide-react"

// Mock data - Same structure as homepage
const comics = Array.from({ length: 48 }, (_, i) => ({
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
  genres: ["Action", "Adventure", "Fantasy"].slice(0, Math.floor(Math.random() * 3) + 1),
}))

// Filter categories
const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
]

const statuses = ["Đang tiến hành", "Hoàn thành", "Tạm dừng"]

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
                      key={genre}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => toggleGenre(genre)}
                        className="w-4 h-4 text-primary border-border rounded cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        {genre}
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
                      key={status}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatus.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className="w-4 h-4 text-primary border-border rounded cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        {status}
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
                          key={genre}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGenres.includes(genre)}
                            onChange={() => toggleGenre(genre)}
                            className="w-4 h-4 text-primary border-border rounded cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                            {genre}
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
                          key={status}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatus.includes(status)}
                            onChange={() => toggleStatus(status)}
                            className="w-4 h-4 text-primary border-border rounded cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                            {status}
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
                    {genre}
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
                    {status}
                    <X className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            )}

            {/* Comics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {comics.map((comic) => (
                <Link
                  key={comic.id}
                  href={`/truyen/${comic.slug}`}
                  className="group cursor-pointer"
                >
                  {/* Comic Card - Matching Homepage Style */}
                  <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-smooth overflow-hidden">
                    {/* Cover Image */}
                    <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                      <Image
                        src={comic.coverImage || "/placeholder.svg"}
                        alt={comic.title}
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
