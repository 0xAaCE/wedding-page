"use client"

import React from "react"

import { useState, useRef } from "react"
import { Loader2, Check, Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PhotoUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PhotoUploadModal({ open, onOpenChange }: PhotoUploadModalProps) {
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
      setTimeout(() => {
        onOpenChange(false)
        setIsSuccess(false)
        setFiles([])
      }, 2000)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Share Your Photos</DialogTitle>
          <DialogDescription className="font-sans">
            Upload your favorite moments from our celebration
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <Check className="w-8 h-8 text-accent-foreground" />
            </div>
            <p className="font-serif text-xl text-foreground">Photos Uploaded!</p>
            <p className="text-muted-foreground text-center">Thank you for sharing these memories with us.</p>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
              <p className="font-sans text-foreground mb-1">Click or drag photos here</p>
              <p className="text-sm text-muted-foreground">JPG, PNG, HEIC up to 10MB each</p>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="font-sans text-sm text-muted-foreground">
                  {files.length} photo{files.length !== 1 ? "s" : ""} selected
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {files.map((file, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        onClick={() => removeFile(index)}
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
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              onClick={handleUpload}
              className="w-full font-sans"
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Upload {files.length > 0 ? `${files.length} Photo${files.length !== 1 ? "s" : ""}` : "Photos"}
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
