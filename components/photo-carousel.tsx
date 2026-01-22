"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollIndicator } from "./scroll-indicator"

const photos = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop",
    alt: "Couple holding hands"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop",
    alt: "Wedding rings"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&h=800&fit=crop",
    alt: "Beautiful sunset"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&h=800&fit=crop",
    alt: "Engagement photo"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&h=800&fit=crop",
    alt: "Happy couple"
  }
]

export function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(nextSlide, 5000)
  }, [nextSlide])

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 5000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [nextSlide])

  const handlePrev = useCallback(() => {
    prevSlide()
    resetTimer()
  }, [prevSlide, resetTimer])

  const handleNext = useCallback(() => {
    nextSlide()
    resetTimer()
  }, [nextSlide, resetTimer])

  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index)
    resetTimer()
  }, [resetTimer])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  return (
    <section id="photos" className="relative min-h-[100dvh] flex flex-col bg-card py-8">
      <h2 className="font-serif text-3xl md:text-5xl text-center text-foreground mb-2 px-4">
        Our Journey
      </h2>
      <p className="text-center text-muted-foreground font-sans mb-4 md:mb-6 max-w-xl mx-auto px-4 text-sm md:text-base">
        A glimpse into our story together
      </p>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="relative w-full max-w-5xl aspect-[5/4] md:aspect-video">
          {/* Main carousel container */}
          <div
            className="relative w-full h-full overflow-hidden rounded-lg shadow-xl bg-muted"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border-border rounded-full shadow-lg"
            onClick={handlePrev}
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border-border rounded-full shadow-lg"
            onClick={handleNext}
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </Button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-1 mt-4">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => handleDotClick(index)}
                className="w-8 h-8 flex items-center justify-center"
                aria-label={`Go to photo ${index + 1}`}
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-border hover:bg-muted-foreground w-2"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator - positioned like hero section */}
      <div className="absolute bottom-12 md:bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ScrollIndicator targetId="thanks" label="Thank You" className="text-foreground" />
      </div>
    </section>
  )
}
