"use client"

import { MapPin, Copy, Check, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ScrollIndicator } from "./scroll-indicator"

export function InfoSection() {
  const [copiedBank, setCopiedBank] = useState(false)
  const [copiedBtc, setCopiedBtc] = useState(false)
  const [copiedEth, setCopiedEth] = useState(false)

  const copyToClipboard = (text: string, type: "bank" | "btc" | "eth") => {
    navigator.clipboard.writeText(text)
    if (type === "bank") {
      setCopiedBank(true)
      setTimeout(() => setCopiedBank(false), 2000)
    } else if (type === "btc") {
      setCopiedBtc(true)
      setTimeout(() => setCopiedBtc(false), 2000)
    } else {
      setCopiedEth(true)
      setTimeout(() => setCopiedEth(false), 2000)
    }
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
          <strong className="text-foreground">Estancia El Campo</strong>
        </p>
        <p>
          Ruta Provincial 25, Km 45<br />
          Buenos Aires, Argentina
        </p>
        <p className="text-sm">
          Saturday, March 14, 2026 at 5:00 PM
        </p>
      </div>

      {/* Embedded Map */}
      <div className="aspect-[4/3] md:aspect-video rounded-lg overflow-hidden shadow-lg border border-border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016888423!2d-58.3815704!3d-34.6036844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x11bead4e234e558b!2sBuenos%20Aires%2C%20Argentina!5e0!3m2!1sen!2sus!4v1640000000000!5m2!1sen!2sus"
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

  // Gifts content component
  const GiftsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Gift className="w-6 h-6 text-primary" />
        <h3 className="font-serif text-3xl md:text-4xl text-foreground">
          Gifts
        </h3>
      </div>

      <p className="font-sans text-muted-foreground">
        Your presence is our greatest gift. However, if you wish to honor us
        with a present, we would appreciate a contribution to our honeymoon fund.
      </p>

      {/* Bank Info */}
      <div className="bg-secondary md:bg-card rounded-lg p-5 space-y-3">
        <h4 className="font-serif text-lg text-foreground">Bank Transfer</h4>
        <div className="font-sans text-sm text-muted-foreground space-y-1">
          <p><strong className="text-foreground">Bank:</strong> Banco Galicia</p>
          <p><strong className="text-foreground">Account Holder:</strong> Alejandro & Clarisa</p>
          <p><strong className="text-foreground">CBU:</strong> 0070999030004123456789</p>
          <p><strong className="text-foreground">Alias:</strong> ALE.CLARI.BODA</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 gap-2 bg-transparent"
          onClick={() => copyToClipboard("0070999030004123456789", "bank")}
        >
          {copiedBank ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copiedBank ? "Copied!" : "Copy CBU"}
        </Button>
      </div>

      {/* Crypto Info */}
      <div className="bg-secondary md:bg-card rounded-lg p-5 space-y-3">
        <h4 className="font-serif text-lg text-foreground">Cryptocurrency</h4>
        <div className="font-sans text-sm text-muted-foreground space-y-2">
          <div>
            <p><strong className="text-foreground">Bitcoin (BTC):</strong></p>
            <p className="font-mono text-xs break-all">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 gap-2 bg-transparent"
              onClick={() => copyToClipboard("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "btc")}
            >
              {copiedBtc ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedBtc ? "Copied!" : "Copy BTC"}
            </Button>
          </div>
          <div className="pt-2">
            <p><strong className="text-foreground">Ethereum (ETH):</strong></p>
            <p className="font-mono text-xs break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 gap-2 bg-transparent"
              onClick={() => copyToClipboard("0x71C7656EC7ab88b098defB751B7401B5f6d8976F", "eth")}
            >
              {copiedEth ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedEth ? "Copied!" : "Copy ETH"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Footer component
  const Footer = () => (
    <div className="mt-16 text-center">
      <p className="font-serif text-xl text-muted-foreground italic">
        We can't wait to celebrate with you
      </p>
    </div>
  )

  return (
    <>
      {/* Scroll target for navigation */}
      <div id="info" />

      {/* Mobile: Venue Section */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center bg-card py-16 md:hidden">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <VenueContent />
        </div>

        {/* Scroll indicator to Gifts */}
        <div className="absolute bottom-12 md:bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ScrollIndicator targetId="gifts" label="Gifts" className="text-foreground" />
        </div>
      </section>

      {/* Mobile: Gifts Section */}
      <section id="gifts" className="relative min-h-[100dvh] flex flex-col items-center justify-center bg-secondary py-16 md:hidden">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <GiftsContent />
        </div>
        <Footer />
      </section>

      {/* Desktop: Combined Section */}
      <section className="relative min-h-[100dvh] hidden md:flex flex-col items-center justify-center bg-card py-16">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="grid md:grid-cols-2 gap-12 md:gap-8">
            <VenueContent />
            <GiftsContent />
          </div>
        </div>
        <Footer />
      </section>
    </>
  )
}
