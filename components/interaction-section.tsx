"use client"

import { useState } from "react"
import { Users, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollIndicator } from "./scroll-indicator"
import { RsvpModal } from "./rsvp-modal"
import { PhotoUploadModal } from "./photo-upload-modal"

export function InteractionSection() {
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const [photoOpen, setPhotoOpen] = useState(false)

  return (
    <section id="interact" className="relative h-screen flex flex-col items-center justify-center bg-secondary">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
          Join Our Celebration
        </h2>
        <p className="text-muted-foreground font-sans mb-12 max-w-xl mx-auto leading-relaxed">
          Let us know you're coming and share your moments with us
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button
            onClick={() => setRsvpOpen(true)}
            size="lg"
            className="font-sans text-lg px-8 py-6 gap-3"
          >
            <Users className="w-5 h-5" />
            Confirm Attendance
          </Button>

          <Button
            onClick={() => setPhotoOpen(true)}
            variant="outline"
            size="lg"
            className="font-sans text-lg px-8 py-6 gap-3"
          >
            <Camera className="w-5 h-5" />
            Share Photos
          </Button>
        </div>
      </div>

      <RsvpModal open={rsvpOpen} onOpenChange={setRsvpOpen} />
      <PhotoUploadModal open={photoOpen} onOpenChange={setPhotoOpen} />

      <ScrollIndicator targetId="photos" label="Our Journey" className="text-foreground" />
    </section>
  )
}
