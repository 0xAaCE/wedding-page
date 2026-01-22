"use client"

import { useState } from "react"
import Image from "next/image"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollIndicator } from "./scroll-indicator"
import { RsvpModal } from "./rsvp-modal"

export function HeroSection() {
  const [rsvpOpen, setRsvpOpen] = useState(false)

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#8B7355]">
      {/* Background Image with priority loading */}
      <Image
        src="/images/wheat-field.jpg"
        alt="Wheat field background"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/40 to-foreground/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="animate-fade-in">
          <p className="text-cream/90 font-body text-sm tracking-[0.3em] uppercase mb-4">
            We're getting married
          </p>
        </div>

        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-cream font-light tracking-wide animate-fade-in-up">
          Ale <span className="text-gold-light">&</span> Clari
        </h1>

        <div className="animate-fade-in-delay mt-8">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-cream/50" />
            <p className="font-display text-2xl md:text-3xl text-cream/90 italic">
              14 / 03 / 2026
            </p>
            <span className="h-px w-16 bg-cream/50" />
          </div>
        </div>

        <div className="animate-fade-in-delay mt-16">
          <Button
            onClick={() => setRsvpOpen(true)}
            size="lg"
            style={{ backgroundColor: "hsla(38, 55%, 80%, 0.3)", boxShadow: "0 0 15px rgba(255, 200, 100, 0.25), 0 0 30px rgba(255, 180, 80, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)" }}
            className="hover:brightness-110 text-foreground font-sans text-lg px-8 py-6 gap-3"
          >
            <Users className="w-5 h-5" />
            Confirm Attendance
          </Button>
        </div>
      </div>

      <RsvpModal open={rsvpOpen} onOpenChange={setRsvpOpen} />

      {/* Scroll Indicator - positioned outside content div */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-in-delay-2">
        <ScrollIndicator targetId="photos" label="Discover our story" className="text-cream" />
      </div>
    </section>
  )
}
