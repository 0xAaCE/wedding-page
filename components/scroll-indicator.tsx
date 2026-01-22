"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScrollIndicatorProps {
  targetId: string
  label: string
  className?: string
}

export function ScrollIndicator({ targetId, label, className }: ScrollIndicatorProps) {
  const scrollToSection = () => {
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <button
      onClick={scrollToSection}
      className={cn(
        "flex flex-col items-center gap-2 group cursor-pointer",
        className
      )}
      aria-label={`Scroll to ${label}`}
    >
      <span className="font-sans text-sm font-medium tracking-widest opacity-90 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
      <ChevronDown className="w-6 h-6 animate-bounce" />
    </button>
  )
}
