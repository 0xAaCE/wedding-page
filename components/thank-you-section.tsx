"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RsvpModal } from "./rsvp-modal"

export function ThankYouSection() {
  const [rsvpOpen, setRsvpOpen] = useState(false)

  return (
    <section id="thanks" className="relative min-h-[100svh] flex flex-col items-center justify-center bg-secondary">
      <div className="max-w-3xl mx-auto px-4 text-center">
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

        <Button
          onClick={() => setRsvpOpen(true)}
          size="lg"
          style={{ backgroundColor: "hsla(38, 55%, 80%, 0.3)", boxShadow: "0 0 15px rgba(255, 200, 100, 0.25), 0 0 30px rgba(255, 180, 80, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)" }}
          className="hover:brightness-110 text-foreground font-sans text-lg px-8 py-6 gap-3 mt-10"
        >
          <Users className="w-5 h-5" />
          Confirmar Asistencia
        </Button>
      </div>

      <RsvpModal open={rsvpOpen} onOpenChange={setRsvpOpen} />
    </section>
  )
}
