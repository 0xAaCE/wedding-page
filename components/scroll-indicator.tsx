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
        "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group cursor-pointer z-10",
        className
      )}
      aria-label={`Scroll to ${label}`}
    >
      <span className="font-sans text-sm tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
      <ChevronDown className="w-6 h-6 animate-bounce" />
    </button>
  )
}
