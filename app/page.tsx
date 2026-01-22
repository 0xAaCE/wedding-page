import { HeroSection } from "@/components/hero-section"
import { PhotoCarousel } from "@/components/photo-carousel"
import { ThankYouSection } from "@/components/thank-you-section"
import { InfoSection } from "@/components/info-section"

export default function WeddingPage() {
  return (
    <main>
      <HeroSection />
      <PhotoCarousel />
      <ThankYouSection />
      <InfoSection />
      
      {/* Footer */}
      <footer className="py-8 bg-secondary text-center">
        <p className="font-serif text-2xl text-foreground">
          Ale & Clari
        </p>
        <p className="font-sans text-sm text-muted-foreground mt-2">
          14 / 03 / 2026
        </p>
      </footer>
    </main>
  )
}
