"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { Loader2, Check, Upload, X, ImageIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SharePhotosPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
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

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("photos", file)
      })

      const response = await fetch("/api/upload-photos", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload photos")
      }

      setIsSuccess(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith("image/")
    )
    setFiles(prev => [...prev, ...droppedFiles])
  }

  const handleReset = () => {
    setIsSuccess(false)
    setFiles([])
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-sans">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              Share Your Photos
            </h1>
            <p className="text-muted-foreground font-sans text-lg max-w-md mx-auto">
              Upload your favorite moments from our celebration. We can't wait to see them!
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-lg p-6 md:p-8">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 gap-6">
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-10 h-10 text-accent-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-serif text-2xl text-foreground mb-2">Photos Uploaded!</p>
                  <p className="text-muted-foreground">Thank you for sharing these memories with us.</p>
                </div>
                <div className="flex gap-4 mt-4">
                  <Button onClick={handleReset} variant="outline" className="font-sans">
                    Upload More Photos
                  </Button>
                  <Link href="/">
                    <Button className="font-sans">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-sans text-foreground text-lg mb-2">Click or drag photos here</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG, HEIC up to 10MB each</p>
                </div>

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
                  onClick={handleUpload}
                  className="w-full font-sans text-lg py-6"
                  size="lg"
                  disabled={isUploading || files.length === 0}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 mr-2" />
                      Upload {files.length > 0 ? `${files.length} Photo${files.length !== 1 ? "s" : ""}` : "Photos"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="font-serif text-xl text-foreground italic">
          Ale & Clari
        </p>
        <p className="text-muted-foreground font-sans text-sm mt-1">
          14 / 03 / 2026
        </p>
      </footer>
    </div>
  )
}
