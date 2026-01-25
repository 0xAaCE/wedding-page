"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollIndicator } from "./scroll-indicator"

const photos = [
  { id: 1, src: "/images/carousel/photo-11.jpg", alt: "Ale y Clari" },
  { id: 2, src: "/images/carousel/photo-01.jpg", alt: "Ale y Clari" },
  { id: 3, src: "/images/carousel/photo-02.jpg", alt: "Ale y Clari" },
  { id: 4, src: "/images/carousel/photo-03.jpg", alt: "Ale y Clari" },
  { id: 5, src: "/images/carousel/photo-04.jpg", alt: "Ale y Clari" },
  { id: 6, src: "/images/carousel/photo-05.jpg", alt: "Ale y Clari" },
  { id: 7, src: "/images/carousel/photo-06.jpg", alt: "Ale y Clari" },
  { id: 8, src: "/images/carousel/photo-07.jpg", alt: "Ale y Clari" },
  { id: 9, src: "/images/carousel/photo-08.jpg", alt: "Ale y Clari" },
  { id: 10, src: "/images/carousel/photo-09.jpg", alt: "Ale y Clari" },
  { id: 11, src: "/images/carousel/photo-10.jpg", alt: "Ale y Clari" },
  { id: 12, src: "/images/carousel/photo-12.jpg", alt: "Ale y Clari" },
  { id: 13, src: "/images/carousel/photo-13.jpg", alt: "Ale y Clari" },
  { id: 14, src: "/images/carousel/photo-14.jpg", alt: "Ale y Clari" },
  { id: 15, src: "/images/carousel/photo-15.jpg", alt: "Ale y Clari" },
  { id: 16, src: "/images/carousel/photo-16.jpg", alt: "Ale y Clari" },
  { id: 17, src: "/images/carousel/photo-17.jpg", alt: "Ale y Clari" },
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
    <section id="photos" className="relative min-h-[100svh] flex flex-col bg-secondary pt-6 pb-8">
      <h2 className="font-serif text-3xl md:text-5xl text-center text-foreground mb-2 px-4">
        Nuestra Historia
      </h2>
      <p className="text-center text-muted-foreground font-sans mb-4 md:mb-6 max-w-xl mx-auto px-4 text-sm md:text-base">
        Un vistazo a nuestra historia juntos
      </p>

      <div className="flex-1 flex items-center justify-center px-4">
        {/* Mobile: Single image carousel */}
        <div className="md:hidden relative w-full max-w-xs">
          <div
            className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-xl bg-muted"
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

          {/* Mobile navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border-border rounded-full shadow-lg"
            onClick={handlePrev}
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border-border rounded-full shadow-lg"
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

        {/* Desktop: 3-image carousel with center focus */}
        <div className="hidden md:block relative w-full max-w-6xl">
          <div className="flex items-center justify-center gap-12 h-[450px]">
            {/* Previous image (left) */}
            <div
              className="relative w-56 h-[400px] rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-500 opacity-60 hover:opacity-80"
              onClick={handlePrev}
            >
              <img
                src={photos[(currentIndex - 1 + photos.length) % photos.length].src || "/placeholder.svg"}
                alt={photos[(currentIndex - 1 + photos.length) % photos.length].alt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Current image (center) */}
            <div className="relative w-56 h-[400px] rounded-lg overflow-hidden shadow-2xl z-10 transition-all duration-500">
              <img
                src={photos[currentIndex].src || "/placeholder.svg"}
                alt={photos[currentIndex].alt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Next image (right) */}
            <div
              className="relative w-56 h-[400px] rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-500 opacity-60 hover:opacity-80"
              onClick={handleNext}
            >
              <img
                src={photos[(currentIndex + 1) % photos.length].src || "/placeholder.svg"}
                alt={photos[(currentIndex + 1) % photos.length].alt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Desktop navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-8 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border-border rounded-full shadow-lg"
            onClick={handlePrev}
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-8 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border-border rounded-full shadow-lg"
            onClick={handleNext}
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </Button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-1 mt-6">
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

      {/* Scroll indicator */}
      <div className="py-4 flex justify-center">
        <ScrollIndicator targetId="info" label="Detalles" className="text-foreground" />
      </div>
    </section>
  )
}
