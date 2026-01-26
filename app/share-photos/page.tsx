"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { Loader2, Check, X, ImageIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PolaroidGallery } from "@/components/polaroid-gallery"

export default function SharePhotosPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith("image/")
      )
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setError("")
    setUploadProgress({ current: 0, total: files.length })

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < files.length; i++) {
      setUploadProgress({ current: i + 1, total: files.length })

      try {
        const formData = new FormData()
        formData.append("photos", files[i])

        const response = await fetch("/api/upload-photos", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          successCount++
        } else {
          failCount++
        }
      } catch {
        failCount++
      }
    }

    setIsUploading(false)

    if (successCount > 0) {
      setIsSuccess(true)
      if (failCount > 0) {
        setError(`${failCount} photo${failCount !== 1 ? "s" : ""} failed to upload`)
      }
    } else {
      setError("Failed to upload photos. Please try again.")
    }
  }

  const handleReset = () => {
    setIsSuccess(false)
    setFiles([])
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col relative">
      {/* Floating Polaroid Gallery Background */}
      <PolaroidGallery limit={20} />

      {/* Title - positioned at top */}
      <div className="px-4 pt-4 relative z-10">
        <div className="text-center bg-secondary/80 backdrop-blur-sm rounded-2xl px-6 py-6 max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">
            Comparte tus fotos del casamiento
          </h1>
        </div>
      </div>

      {/* Main Content - positioned at bottom */}
      <main className="flex-1 flex items-end justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-2xl">
          <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 gap-6">
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-10 h-10 text-accent-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-serif text-2xl text-foreground mb-2">Foto subida!</p>
                  <p className="text-muted-foreground">Gracias por compartir estas recuerdos con nosotros.</p>
                </div>
                <div className="flex gap-4 mt-4">
                  <Button onClick={handleReset} variant="outline" className="font-sans">
                    Subir más fotos
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                {files.length > 0 && (
                  <div className="space-y-4">
                    <p className="font-sans text-muted-foreground">
                      {files.length} photo{files.length !== 1 ? "s" : ""} selected
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {files.map((file, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFile(index)
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}

                <Button
                  onClick={files.length === 0 ? () => fileInputRef.current?.click() : handleUpload}
                  className="w-full font-sans text-lg py-6"
                  size="lg"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Subiendo {uploadProgress.current}/{uploadProgress.total}...
                    </>
                  ) : files.length === 0 ? (
                    <>
                      <ImageIcon className="w-5 h-5 mr-2" />
                      Seleccionar fotos
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 mr-2" />
                      Subir {files.length} foto{files.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center relative z-10">
        <div className="inline-block bg-secondary/80 backdrop-blur-sm rounded-xl px-6 py-3">
          <p className="font-serif text-xl text-foreground italic">
            Ale & Clari
          </p>
          <p className="text-muted-foreground font-sans text-sm mt-1">
            14 / 03 / 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
