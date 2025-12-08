"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface SectionCarouselProps {
  title: string
  icon: LucideIcon
  items: any[]
  viewAllLink?: string
  renderCard: (item: any) => React.ReactNode
  className?: string
  cardWidth?: string
  gap?: string
}

export function SectionCarousel({
  title,
  icon: Icon,
  items,
  viewAllLink,
  renderCard,
  className,
  cardWidth = "160px",
  gap = "gap-3",
}: SectionCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  React.useEffect(() => {
    if (!api) return

    const updateScrollButtons = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    updateScrollButtons()
    api.on("select", updateScrollButtons)
    api.on("reInit", updateScrollButtons)

    return () => {
      api.off("select", updateScrollButtons)
      api.off("reInit", updateScrollButtons)
    }
  }, [api])

  return (
    <section className={cn("bg-card rounded-lg shadow-md border border-border p-6 overflow-hidden", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Icon className="w-6 h-6 text-primary" />
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-lg border border-border",
              "bg-card hover:bg-muted transition-colors duration-200 cursor-pointer",
              !canScrollPrev && "opacity-30 cursor-not-allowed hover:bg-card"
            )}
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-lg border border-border",
              "bg-card hover:bg-muted transition-colors duration-200 cursor-pointer",
              !canScrollNext && "opacity-30 cursor-not-allowed hover:bg-card"
            )}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-sm text-primary hover:underline cursor-pointer ml-2"
            >
              Xem tất cả
            </Link>
          )}
        </div>
      </div>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className={cn("-ml-3", gap)}>
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-3"
              style={{ flexBasis: cardWidth }}
            >
              {renderCard(item)}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
