"use client"

import React, { useState } from "react"

interface PolaroidPhotoProps {
  src: string
  alt: string
  rotation?: number
  className?: string
}

export function PolaroidPhoto({ src, alt, rotation = 0, className = "" }: PolaroidPhotoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return null
  }

  return (
    <div
      className={`bg-white p-2 pb-8 shadow-lg transition-all duration-300 ease-out cursor-pointer ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-muted">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </div>
    </div>
  )
}
