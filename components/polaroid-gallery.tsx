"use client"

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react"
import { PolaroidPhoto } from "./polaroid-photo"

interface Photo {
  id: string
  name: string
  url: string
  createdTime: string
}

interface PolaroidPosition {
  left: string
  top: string
  rotation: number
  duration: number
  delay: number
  driftX: number
  driftY: number
  size: number
}

interface PolaroidGalleryProps {
  limit?: number // If provided, only fetch this many photos. If not, load all in batches.
}

const BATCH_SIZE = 20

function generatePosition(index: number, total: number): PolaroidPosition {
  // Use seeded random based on index for consistent positions between renders
  const seed = index * 137.5
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  // Calculate grid dimensions based on total photos - use full screen
  const cols = Math.ceil(Math.sqrt(total * 1.5)) // Wider than tall (landscape)
  const rows = Math.ceil(total / cols)

  // Distribute photos across FULL viewport (0-100%)
  const column = index % cols
  const row = Math.floor(index / cols) % rows

  const colWidth = 100 / cols
  const rowHeight = 100 / rows

  // Position with randomness, allowing full screen coverage
  const baseLeft = column * colWidth + random(1) * (colWidth * 0.6)
  const baseTop = row * rowHeight + random(2) * (rowHeight * 0.6)

  return {
    left: `${Math.min(Math.max(baseLeft, 0), 95)}%`,
    top: `${Math.min(Math.max(baseTop, 0), 92)}%`,
    rotation: (random(3) - 0.5) * 20, // -10 to +10 degrees
    duration: 15 + random(4) * 15, // 15-30 seconds
    delay: random(5) * -10, // staggered start
    driftX: (random(6) - 0.5) * 30, // -15 to +15 pixels
    driftY: (random(7) - 0.5) * 30, // -15 to +15 pixels
    size: 120 + random(8) * 60, // 120-180 pixels
  }
}

export function PolaroidGallery({ limit }: PolaroidGalleryProps = {}) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [pageToken, setPageToken] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const loadingRef = useRef(false)

  const fetchPhotos = useCallback(async (token?: string | null) => {
    if (loadingRef.current) return
    loadingRef.current = true

    try {
      const fetchLimit = limit || BATCH_SIZE
      const params = new URLSearchParams({ limit: String(fetchLimit) })
      if (token) {
        params.append("pageToken", token)
      }
      // Use weighted random selection when limit is provided
      if (limit && !token) {
        params.append("random", "true")
      }

      const response = await fetch(`/api/photos?${params}`)
      if (response.ok) {
        const data = await response.json()
        const newPhotos = data.photos || []

        setPhotos(prev => token ? [...prev, ...newPhotos] : newPhotos)
        setPageToken(data.nextPageToken || null)
        // Only continue loading if no limit is set
        setHasMore(!limit && !!data.nextPageToken && newPhotos.length === fetchLimit)
      }
    } catch (error) {
      console.error("Failed to fetch photos:", error)
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [limit])

  // Initial load
  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  // Load more photos when we have more to fetch (only when no limit)
  useEffect(() => {
    if (limit || !hasMore || isLoading || !pageToken) return

    const loadMoreTimeout = setTimeout(() => {
      fetchPhotos(pageToken)
    }, 1000) // Delay between batch loads

    return () => clearTimeout(loadMoreTimeout)
  }, [limit, hasMore, isLoading, pageToken, fetchPhotos])

  const positions = useMemo(
    () => photos.map((_, index) => generatePosition(index, photos.length)),
    [photos]
  )

  if (isLoading || photos.length === 0) {
    return null
  }

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {photos.map((photo, index) => {
          const pos = positions[index]
          const isHovered = hoveredId === photo.id
          return (
            <div
              key={photo.id}
              className="absolute animate-float-polaroid pointer-events-auto cursor-pointer"
              style={{
                left: pos.left,
                top: pos.top,
                width: `${pos.size}px`,
                zIndex: isHovered ? 100 : 1,
                "--rotation": `${pos.rotation}deg`,
                "--duration": `${pos.duration}s`,
                "--delay": `${pos.delay}s`,
                "--drift-x": `${pos.driftX}px`,
                "--drift-y": `${pos.driftY}px`,
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredId(photo.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div
                className="transition-all duration-300 ease-out"
                style={{
                  transform: isHovered ? 'scale(1.8) translateY(-10px)' : 'scale(1)',
                  filter: isHovered ? 'drop-shadow(0 25px 25px rgba(0,0,0,0.3))' : 'none',
                }}
              >
                <PolaroidPhoto
                  src={photo.url}
                  alt={photo.name}
                  rotation={0}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-[90vw] max-h-[90vh] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white p-3 pb-12 shadow-2xl">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
