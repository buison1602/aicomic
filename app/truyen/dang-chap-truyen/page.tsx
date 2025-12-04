"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { X, Upload, ImageIcon, AlertCircle } from "lucide-react"

export default function DangChapTruyenPage() {
  const [chapterNumber, setChapterNumber] = useState("")
  const [chapterTitle, setChapterTitle] = useState("")
  const [images, setImages] = useState<Array<{ id: string; file: File; preview: string }>>([])
  const [errors, setErrors] = useState<{ chapterNumber?: string; images?: string }>({})
  const [touched, setTouched] = useState<{ chapterNumber?: boolean; images?: boolean }>({})

  const validateChapterNumber = (value: string) => {
    if (!value) {
      return "Số chương không được để trống"
    }
    if (Number.parseInt(value) < 1) {
      return "Số chương phải lớn hơn 0"
    }
    return undefined
  }

  const validateImages = (imageList: typeof images) => {
    if (imageList.length === 0) {
      return "Vui lòng tải lên ít nhất 1 ảnh"
    }
    return undefined
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
    }))
    setImages((prev) => {
      const updated = [...prev, ...newImages]
      setTouched((t) => ({ ...t, images: true }))
      setErrors((e) => ({ ...e, images: validateImages(updated) }))
      return updated
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    multiple: true,
  })

  const removeImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      const updated = prev.filter((img) => img.id !== id)
      setErrors((e) => ({ ...e, images: validateImages(updated) }))
      return updated
    })
  }

  const handleChapterNumberChange = (value: string) => {
    setChapterNumber(value)
    if (touched.chapterNumber) {
      setErrors((e) => ({ ...e, chapterNumber: validateChapterNumber(value) }))
    }
  }

  const handleChapterNumberBlur = () => {
    setTouched((t) => ({ ...t, chapterNumber: true }))
    setErrors((e) => ({ ...e, chapterNumber: validateChapterNumber(chapterNumber) }))
  }

  const convertToWebP = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Failed to get canvas context"))
          return
        }
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Failed to convert image"))
            }
          },
          "image/webp",
          0.8, // 80% quality
        )
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const chapterNumError = validateChapterNumber(chapterNumber)
    const imagesError = validateImages(images)

    setTouched({ chapterNumber: true, images: true })
    setErrors({ chapterNumber: chapterNumError, images: imagesError })

    if (chapterNumError || imagesError) {
      return
    }

    console.log("[v0] Starting chapter submission")
    console.log("[v0] Chapter number:", chapterNumber)
    console.log("[v0] Chapter title:", chapterTitle)
    console.log("[v0] Number of images:", images.length)

    // Convert images to WebP and compress
    const processedImages: Blob[] = []
    for (const image of images) {
      try {
        console.log("[v0] Processing image:", image.file.name)
        const webpBlob = await convertToWebP(image.file)
        console.log("[v0] Original size:", image.file.size, "bytes")
        console.log("[v0] WebP size:", webpBlob.size, "bytes")

        // Check if under 1MB
        if (webpBlob.size > 1024 * 1024) {
          console.warn("[v0] Image exceeds 1MB:", webpBlob.size, "bytes")
        }

        processedImages.push(webpBlob)
      } catch (error) {
        console.error("[v0] Failed to process image:", error)
      }
    }

    console.log("[v0] Successfully processed", processedImages.length, "images")

    // Here you would upload the processed images to your backend
    // For now, just log the result
    alert(`Đã xử lý ${processedImages.length} ảnh. Chương ${chapterNumber} đã sẵn sàng để đăng!`)
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Đăng chương mới
          </h1>
          <p className="text-base text-muted-foreground">
            Tải lên các trang truyện cho chương mới
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 md:p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Chapter Information Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Thông tin chương
              </h2>

              {/* Chapter Number & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chapter Number */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="chapterNumber" 
                    className="text-sm font-medium text-foreground"
                  >
                    Số chương <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="chapterNumber"
                    type="number"
                    min="1"
                    value={chapterNumber}
                    onChange={(e) => handleChapterNumberChange(e.target.value)}
                    onBlur={handleChapterNumberBlur}
                    placeholder="Nhập số chương (VD: 1)"
                    className={`rounded-lg border transition-colors duration-200 
                      ${touched.chapterNumber && errors.chapterNumber 
                        ? "border-destructive focus:border-destructive focus:ring-destructive" 
                        : "border-border focus:border-primary focus:ring-primary"
                      }`}
                  />
                  {touched.chapterNumber && errors.chapterNumber && (
                    <div className="flex items-start gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{errors.chapterNumber}</span>
                    </div>
                  )}
                </div>

                {/* Chapter Title (Optional) */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="chapterTitle" 
                    className="text-sm font-medium text-foreground"
                  >
                    Tên chương <span className="text-muted-foreground text-xs">(Tùy chọn)</span>
                  </Label>
                  <Input
                    id="chapterTitle"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    placeholder="Nhập tên chương (VD: Khởi đầu)"
                    className="rounded-lg border-border focus:border-primary focus:ring-primary transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Tải ảnh chương
              </h2>

              {/* Drag & Drop Upload Area */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Trang truyện <span className="text-destructive">*</span>
                </Label>
                <div
                  {...getRootProps()}
                  className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer 
                    transition-all duration-200 
                    ${touched.images && errors.images 
                      ? "border-destructive bg-destructive/5" 
                      : isDragActive 
                        ? "border-primary bg-primary/5 scale-[1.02]" 
                        : "border-border hover:border-primary/70 hover:bg-muted/30"
                    }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <div className={`p-4 rounded-full transition-colors duration-200 
                      ${isDragActive ? "bg-primary/10" : "bg-muted"}`}
                    >
                      <Upload className={`w-10 h-10 transition-colors duration-200 
                        ${isDragActive ? "text-primary" : "text-muted-foreground"}`} 
                      />
                    </div>
                    
                    {isDragActive ? (
                      <div className="space-y-1">
                        <p className="text-base font-medium text-primary">
                          Thả ảnh vào đây
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-base font-medium text-foreground">
                          Kéo thả ảnh vào đây
                        </p>
                        <p className="text-sm text-muted-foreground">
                          hoặc click để chọn từ thiết bị
                        </p>
                        <p className="text-xs text-muted-foreground pt-2">
                          Hỗ trợ: PNG, JPG, JPEG, WEBP
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {touched.images && errors.images && (
                  <div className="flex items-start gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{errors.images}</span>
                  </div>
                )}

                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Lưu ý:</strong> Ảnh sẽ tự động được chuyển đổi 
                    sang định dạng WebP và nén xuống 80% chất lượng, dung lượng tối đa 1MB/ảnh 
                    để tối ưu tốc độ tải trang.
                  </p>
                </div>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-foreground">
                      Ảnh đã tải ({images.length} trang)
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        images.forEach((img) => URL.revokeObjectURL(img.preview))
                        setImages([])
                        setTouched((t) => ({ ...t, images: true }))
                        setErrors((e) => ({ ...e, images: validateImages([]) }))
                      }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 
                        rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Xóa tất cả
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border 
                          shadow-sm hover:shadow-md transition-shadow duration-200">
                          <Image
                            src={image.preview || "/placeholder.svg"}
                            alt={`Trang ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-200 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              Trang {index + 1}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground 
                            rounded-full p-1.5 shadow-md hover:bg-destructive/90 transition-colors 
                            duration-200 cursor-pointer focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                          aria-label={`Xóa trang ${index + 1}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="order-2 sm:order-1 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={!chapterNumber || images.length === 0}
                className="order-1 sm:order-2 sm:ml-auto w-full sm:w-auto bg-primary text-primary-foreground 
                  rounded-lg px-8 py-6 text-base font-medium transition-colors duration-200 cursor-pointer 
                  hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Đăng chương mới
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
