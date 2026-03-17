"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import { PolaroidPhoto } from "./polaroid-photo"

interface Photo {
  id: string
  name: string
  url: string
  createdTime: string
}

const BATCH_SIZE = 6

export function PhotoGrid() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageToken, setPageToken] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  const fetchPhotos = useCallback(async (token?: string | null) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setIsLoading(true)

    try {
      const params = new URLSearchParams({ limit: String(BATCH_SIZE) })
      if (token) params.append("pageToken", token)

      const response = await fetch(`/api/photos?${params}`)
      if (response.ok) {
        const data = await response.json()
        const newPhotos: Photo[] = data.photos || []
        setPhotos(prev => token ? [...prev, ...newPhotos] : newPhotos)
        setPageToken(data.nextPageToken || null)
        setHasMore(!!data.nextPageToken && newPhotos.length === BATCH_SIZE)
      }
    } catch (error) {
      console.error("Failed to fetch photos:", error)
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchPhotos()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current && hasMore && pageToken) {
          fetchPhotos(pageToken)
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchPhotos, hasMore, pageToken])

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {photos.map((photo) => (
          <PolaroidPhoto
            key={photo.id}
            src={photo.url}
            alt={photo.name}
          />
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-8" />

      {isLoading && (
        <div className="flex justify-center py-6">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {!hasMore && photos.length > 0 && (
        <p className="text-center text-muted-foreground font-sans text-sm py-6">
          — Fin —
        </p>
      )}
    </div>
  )
}
