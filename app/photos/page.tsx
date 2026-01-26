"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PolaroidGallery } from "@/components/polaroid-gallery"

export default function PhotosPage() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col relative">
      {/* Floating Polaroid Gallery Background */}
      <PolaroidGallery />

      {/* Header */}
      <header className="p-4 md:p-6 relative z-10 pointer-events-none">
        <Link
          href="/share-photos"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-sans bg-secondary/80 backdrop-blur-sm rounded-full px-4 py-2 pointer-events-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Compartir fotos
        </Link>
      </header>

      {/* Centered Title Section */}
      <main className="flex-1 flex items-center justify-center px-4 relative z-10 pointer-events-none">
        <div className="text-center bg-secondary/80 backdrop-blur-sm rounded-2xl px-8 py-10 max-w-2xl">
          <p className="font-serif text-4xl md:text-5xl text-foreground">
            Nuestro Casamiento
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center relative z-10 pointer-events-none">
        <div className="inline-block bg-secondary/80 backdrop-blur-sm rounded-xl px-6 py-3">
          <p className="font-serif text-xl text-foreground italic">Ale & Clari</p>
          <p className="text-muted-foreground font-sans text-sm mt-1">14 / 03 / 2026</p>
        </div>
      </footer>
    </div>
  )
}
