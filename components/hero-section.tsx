"use client"

import { ScrollIndicator } from "./scroll-indicator"

export function HeroSection() {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/wheat-field.jpg')" }}
      >
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-card tracking-wide mb-6 drop-shadow-lg">
          <span className="block">Ale & Clari</span>
        </h1>
        <p className="font-serif text-2xl md:text-4xl lg:text-5xl font-light text-card tracking-widest drop-shadow-md">
          14 / 03 / 2026
        </p>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator targetId="interact" label="Join Us" className="text-card drop-shadow-md" />
    </section>
  )
}
