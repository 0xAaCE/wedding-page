"use client"

import { MapPin, Copy, Check, Gift, Shirt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ScrollIndicator } from "./scroll-indicator"

export function InfoSection() {
  const [copiedBank, setCopiedBank] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedBank(true)
    setTimeout(() => setCopiedBank(false), 2000)
  }

  // Venue content component
  const VenueContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-6 h-6 text-primary" />
        <h3 className="font-serif text-3xl md:text-4xl text-foreground">
          Venue
        </h3>
      </div>

      <div className="space-y-4 font-sans text-muted-foreground">
        <p className="text-lg">
          <strong className="text-foreground">Estación Fátima Eventos ~ 14/03/2026 a las 12:00 hs</strong>
        </p>
        <p>
          Isla Jorge 290, Fátima,<br/>Provincia de Buenos Aires
        </p>
      </div>

      {/* Embedded Map */}
      <div className="aspect-[4/3] md:aspect-video rounded-lg overflow-hidden shadow-lg border border-border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3292.5!2d-58.9923492!3d-34.4357678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc820b778e6a25%3A0x9cde5ab639d2b44b!2sEstaci%C3%B3n%20F%C3%A1tima%20Eventos!5e0!3m2!1ses!2sar!4v1705000000000!5m2!1ses!2sar"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Wedding venue location"
        />
      </div>
    </div>
  )

  // Dress code content component
  const VestimentaContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Shirt className="w-6 h-6 text-primary" />
        <h3 className="font-serif text-3xl md:text-4xl text-foreground">
          Vestimenta
        </h3>
      </div>

      <p className="font-sans text-muted-foreground">
        El código de vestimenta es <strong className="text-foreground underline underline-offset-4">elegante</strong>. 
        Te recomendamos traer un <span className="text-foreground underline underline-offset-4">cambio de ropa</span> por si el clima nos acompaña y podemos disfrutar de la pileta.
      </p>
    </div>
  )

  // Gifts content component
  const GiftsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Gift className="w-6 h-6 text-primary" />
        <h3 className="font-serif text-3xl md:text-4xl text-foreground">
          Regalos
        </h3>
      </div>

      <p className="font-sans text-muted-foreground">
        Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, agradeceríamos una contribución para nuestra luna de miel.
      </p>

      {/* Bank Info */}
      <div className="bg-secondary md:bg-card rounded-lg p-5 space-y-3">
        <h4 className="font-serif text-lg text-foreground">Transferencia Bancaria</h4>
        <div className="font-sans text-sm text-muted-foreground space-y-1">
          <p><strong className="text-foreground">Banco:</strong> Banco Santander</p>
          <p><strong className="text-foreground">Titular:</strong> Alejo & Clara</p>
          <p><strong className="text-foreground">CBU:</strong> 0720049688000003143186</p>
          <p><strong className="text-foreground">Alias:</strong> ALE.Y.CLA.SANTANDER</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 gap-2 bg-transparent"
          onClick={() => copyToClipboard("0070999030004123456789")}
        >
          {copiedBank ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copiedBank ? "¡Copiado!" : "Copiar CBU"}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Scroll target for navigation */}
      <div id="info" />

      {/* Mobile: Venue Section */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-card py-16 md:hidden">
        <div className="max-w-6xl mx-auto px-4 w-full pb-16">
          <VenueContent />
        </div>

        {/* Scroll indicator to Vestimenta */}
        <div className="absolute bottom-12 md:bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ScrollIndicator targetId="vestimenta" label="Vestimenta" className="text-foreground" />
        </div>
      </section>

      {/* Mobile: Vestimenta Section */}
      <section id="vestimenta" className="relative min-h-[100svh] flex flex-col items-center justify-center bg-secondary py-16 md:hidden">
        <div className="max-w-6xl mx-auto px-4 w-full pb-16">
          <VestimentaContent />
        </div>

        {/* Scroll indicator to Gifts */}
        <div className="absolute bottom-12 md:bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ScrollIndicator targetId="gifts" label="Regalos" className="text-foreground" />
        </div>
      </section>

      {/* Mobile: Gifts Section */}
      <section id="gifts" className="relative min-h-[100svh] flex flex-col items-center justify-center bg-card py-16 md:hidden">
        <div className="max-w-6xl mx-auto px-4 w-full pb-16">
          <GiftsContent />
        </div>

        {/* Scroll indicator to Gracias */}
        <div className="absolute bottom-12 md:bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ScrollIndicator targetId="thanks" label="Gracias" className="text-foreground" />
        </div>
      </section>

      {/* Desktop: Combined Section */}
      <section className="relative min-h-[100svh] hidden md:flex flex-col items-center justify-center bg-card py-16">
        <div className="max-w-6xl mx-auto px-4 w-full pb-16">
          <div className="grid md:grid-cols-2 gap-12 md:gap-8">
            <VenueContent />
            <div className="space-y-12">
              <VestimentaContent />
              <GiftsContent />
            </div>
          </div>
        </div>

        {/* Scroll indicator to Gracias */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ScrollIndicator targetId="thanks" label="Gracias" className="text-foreground" />
        </div>
      </section>
    </>
  )
}
