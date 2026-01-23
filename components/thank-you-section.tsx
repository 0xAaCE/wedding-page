"use client"

import { ScrollIndicator } from "./scroll-indicator"

export function ThankYouSection() {
  return (
    <section id="thanks" className="relative min-h-[100svh] flex flex-col items-center justify-center bg-secondary">
      <div className="max-w-3xl mx-auto px-4 text-center pb-20">
        <div className="mb-8">
          <svg 
            className="w-12 h-12 mx-auto text-primary" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        
        <div className="space-y-6 font-sans text-lg md:text-xl text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground block mb-2 text-2xl md:text-3xl">Gracias</strong>
            por acompañarnos en este día tan especial.<br />
            Su presencia es el mejor regalo que podemos recibir.
          </p>
          <p className="font-serif text-2xl text-foreground italic mt-8">
            Con todo nuestro amor,<br />
            Ale & Clari
          </p>
        </div>
      </div>

      {/* Scroll indicator - positioned like hero section */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ScrollIndicator targetId="info" label="Detalles" className="text-foreground" />
      </div>
    </section>
  )
}
