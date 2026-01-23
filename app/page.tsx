"use client"

import { useEffect } from "react"
import { HeroSection } from "@/components/hero-section"
import { PhotoCarousel } from "@/components/photo-carousel"
import { ThankYouSection } from "@/components/thank-you-section"
import { InfoSection } from "@/components/info-section"

export default function WeddingPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main>
      <HeroSection />
      <PhotoCarousel />
      <InfoSection />
      <ThankYouSection />
    </main>
  )
}
