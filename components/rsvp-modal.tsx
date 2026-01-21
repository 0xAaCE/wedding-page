"use client"

import React from "react"

import { useState } from "react"
import { Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RsvpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RsvpModal({ open, onOpenChange }: RsvpModalProps) {
  const [name, setName] = useState("")
  const [dietaryRestrictions, setDietaryRestrictions] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dietaryRestrictions }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit RSVP")
      }

      setIsSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        setIsSuccess(false)
        setName("")
        setDietaryRestrictions("")
      }, 2000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Confirm Your Attendance</DialogTitle>
          <DialogDescription className="font-sans">
            We're excited to have you! Please let us know if you have any dietary restrictions.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <Check className="w-8 h-8 text-accent-foreground" />
            </div>
            <p className="font-serif text-xl text-foreground">Thank you!</p>
            <p className="text-muted-foreground text-center">We can't wait to celebrate with you.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-sans">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietary" className="font-sans">
                Dietary Restrictions <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="dietary"
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                placeholder="Vegetarian, vegan, allergies, etc."
                rows={3}
                className="font-sans resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full font-sans"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Confirm Attendance"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
