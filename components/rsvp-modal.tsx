"use client"

import React from "react"

import { useState } from "react"
import { Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [dietaryRestrictions, setDietaryRestrictions] = useState("none")
  const [needsTransport, setNeedsTransport] = useState("no")
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
        body: JSON.stringify({ name, dietaryRestrictions, needsTransport }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit RSVP")
      }

      setIsSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        setIsSuccess(false)
        setName("")
        setDietaryRestrictions("none")
        setNeedsTransport("no")
      }, 2000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Confirma tu Asistencia</DialogTitle>
          <DialogDescription className="font-sans">
            ¡Estamos emocionados de tenerte! Por favor, indícanos si tienes alguna restricción alimentaria.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                <Check className="w-8 h-8 text-accent-foreground" />
              </div>
              <p className="font-serif text-xl text-foreground">¡Gracias!</p>
              <p className="text-muted-foreground text-center">No podemos esperar a celebrar contigo.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 pt-4 pb-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-sans">Tu Nombre</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                  required
                  className="font-sans"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietary" className="font-sans">Restricciones Alimentarias</Label>
                <Select value={dietaryRestrictions} onValueChange={setDietaryRestrictions}>
                  <SelectTrigger className="w-full font-sans">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguna</SelectItem>
                    <SelectItem value="celiac">Celíaco</SelectItem>
                    <SelectItem value="vegetarian">Vegetariano</SelectItem>
                    <SelectItem value="vegan">Vegano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transport" className="font-sans">Organizaremos transporte desde Urquiza hasta la ceremonia, te sumas?</Label>
                <Select value={needsTransport} onValueChange={setNeedsTransport}>
                  <SelectTrigger className="w-full font-sans">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Sí</SelectItem>
                  </SelectContent>
                </Select>
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
                    Enviando...
                  </>
                ) : (
                  "Confirmar Asistencia"
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
