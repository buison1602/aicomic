"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, List, Home } from "lucide-react"

interface Page {
  id: number
  pageNumber: number
  imageUrl: string
}

interface Chapter {
  id: number
  chapterNumber: number
}

interface ChapterReaderProps {
  slug: string
  chapterNum: number
  chapter: Chapter
  pages: Page[]
  totalChapters: number
}

export default function ChapterReader({ slug, chapterNum, chapter, pages, totalChapters }: ChapterReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Calculate scroll progress percentage
      const scrolled = (currentScrollY / (documentHeight - windowHeight)) * 100
      setScrollProgress(Math.min(scrolled, 100))

      // Show/hide controls based on scroll direction
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // Scrolling up or near top
        setShowControls(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and not near top
        setShowControls(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <div className="bg-background min-h-screen">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Header - Auto-hide */}
      <header
        className={`fixed top-1 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
          showControls ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-md border border-border">
            <div className="px-4 py-3 flex items-center justify-between gap-4">
              {/* Left: Back to Comic */}
              <Link
                href={`/truyen/${slug}`}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground 
                  hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Danh sách</span>
              </Link>

              {/* Center: Chapter Title */}
              <div className="flex-1 text-center">
                <h1 className="text-sm md:text-base font-semibold text-foreground truncate">
                  Chương {chapterNum}
                </h1>
              </div>

              {/* Right: Home */}
              <Link
                href="/trang-chu"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground 
                  hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Trang chủ</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Reading Area - Distraction-free */}
      <main className="pt-20 pb-24">
        {/* Centered Content Container */}
        <div className="max-w-4xl mx-auto px-4">
          {/* Comic Pages - Optimized for Reading */}
          <div className="space-y-2">
            {pages.length > 0 ? (
              pages.map((page, index) => (
                <div key={page.id} className="w-full">
                  <div className="relative w-full bg-muted rounded-sm overflow-hidden">
                    <Image
                      src={page.imageUrl}
                      alt={`Trang ${page.pageNumber}`}
                      width={1200}
                      height={1600}
                      className="w-full h-auto"
                      priority={index < 3}
                      quality={90}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Chương này chưa có trang nào
              </div>
            )}
          </div>

          {/* End of Chapter Message */}
          {pages.length > 0 && (
            <div className="mt-12 mb-8 text-center space-y-4 py-8 border-t border-border">
              <p className="text-lg font-medium text-foreground">
                Hết chương {chapterNum}
              </p>
              <p className="text-sm text-muted-foreground">
                Cảm ơn bạn đã đọc
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Footer Navigation - Auto-hide */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
          showControls ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-md border border-border">
            <div className="px-4 py-3 flex items-center justify-between gap-2 sm:gap-4">
              {/* Previous Chapter Button */}
              {chapterNum > 1 ? (
                <Link href={`/truyen/${slug}/${chapterNum - 1}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-lg transition-colors duration-200 cursor-pointer hover:bg-secondary"
                  >
                    <ChevronLeft className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Trước</span>
                  </Button>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {/* Chapter List Button */}
              <Link href={`/truyen/${slug}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full rounded-lg transition-colors duration-200 cursor-pointer hover:bg-secondary"
                >
                  <List className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Danh sách</span>
                </Button>
              </Link>

              {/* Next Chapter Button */}
              {chapterNum < totalChapters ? (
                <Link href={`/truyen/${slug}/${chapterNum + 1}`} className="flex-1">
                  <Button
                    className="w-full bg-primary text-primary-foreground rounded-lg transition-colors 
                      duration-200 cursor-pointer hover:opacity-90"
                  >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="w-4 h-4 sm:ml-2" />
                  </Button>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
