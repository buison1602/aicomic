'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookPlus, AlertCircle, Check } from 'lucide-react';
import { LoginDialog } from '@/components/login-dialog';
import { createStory, getUserStories } from './actions';
import { compressImage } from '@/lib/image-compression';

const genres = [
  "Hành động",
  "Phiêu lưu",
  "Kinh dị",
  "Hài hước",
  "Lãng mạn",
  "Giả tưởng",
  "Khoa học viễn tưởng",
  "Trinh thám",
  "Học đường",
  "Drama",
  "Võ thuật",
  "Siêu nhiên",
]

export default function DangTruyenPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    status: "",
    genres: [] as string[],
    description: "",
    thumbnail: null as File | null,
  })

  const [errors, setErrors] = useState<{
    name?: string
    author?: string
    status?: string
    genres?: string
    description?: string
    thumbnail?: string
  }>({})

  const [touched, setTouched] = useState<{
    name?: boolean
    author?: boolean
    status?: boolean
    genres?: boolean
    description?: boolean
    thumbnail?: boolean
  }>({})

  const validateName = (value: string) => {
    if (!value.trim()) return "Tên truyện không được để trống"
    if (value.length < 3) return "Tên truyện phải có ít nhất 3 ký tự"
    return undefined
  }

  const validateAuthor = (value: string) => {
    if (!value.trim()) return "Tên tác giả không được để trống"
    return undefined
  }

  const validateStatus = (value: string) => {
    if (!value) return "Vui lòng chọn trạng thái"
    return undefined
  }

  const validateGenres = (genres: string[]) => {
    if (genres.length === 0) return "Vui lòng chọn ít nhất 1 thể loại"
    if (genres.length > 5) return "Chỉ được chọn tối đa 5 thể loại"
    return undefined
  }

  const validateDescription = (value: string) => {
    if (!value.trim()) return "Mô tả không được để trống"
    if (value.length < 50) return "Mô tả phải có ít nhất 50 ký tự"
    if (value.length > 1000) return "Mô tả không được vượt quá 1000 ký tự"
    return undefined
  }

  const validateThumbnail = (file: File | null) => {
    if (!file) return "Vui lòng chọn ảnh đại diện truyện"
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return "Chỉ chấp nhận file ảnh JPG, PNG hoặc WEBP"
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return "Kích thước file không được vượt quá 5MB"
    }
    
    return undefined
  }

  const handleFieldBlur = (field: keyof typeof touched) => {
    setTouched((t) => ({ ...t, [field]: true }))
    
    let error: string | undefined
    switch (field) {
      case "name":
        error = validateName(formData.name)
        break
      case "author":
        error = validateAuthor(formData.author)
        break
      case "status":
        error = validateStatus(formData.status)
        break
      case "genres":
        error = validateGenres(formData.genres)
        break
      case "description":
        error = validateDescription(formData.description)
        break
      case "thumbnail":
        error = validateThumbnail(formData.thumbnail)
        break
    }
    
    setErrors((e) => ({ ...e, [field]: error }))
  }

  const toggleGenre = (genre: string) => {
    setFormData((prev) => {
      const newGenres = prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre]
      
      if (touched.genres) {
        setErrors((e) => ({ ...e, genres: validateGenres(newGenres) }))
      }
      
      return { ...prev, genres: newGenres }
    })
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userStories, setUserStories] = useState<Array<{
    id: number;
    slug: string;
    title: string;
    thumbnailUrl: string | null;
    createdAt: string | null;
    chapterCount: number;
  }>>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);

  // Fetch user stories on mount
  useEffect(() => {
    async function fetchStories() {
      setIsLoadingStories(true);
      const result = await getUserStories();
      if (result.success) {
        setUserStories(result.stories);
      }
      setIsLoadingStories(false);
    }
    fetchStories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {
      name: validateName(formData.name),
      author: validateAuthor(formData.author),
      status: validateStatus(formData.status),
      genres: validateGenres(formData.genres),
      description: validateDescription(formData.description),
      thumbnail: validateThumbnail(formData.thumbnail),
    }

    setTouched({
      name: true,
      author: true,
      status: true,
      genres: true,
      description: true,
      thumbnail: true,
    })

    setErrors(newErrors)

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== undefined)) {
      return
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.set('title', formData.name);
      formDataToSend.set('author', formData.author);
      formDataToSend.set('status', formData.status);
      formDataToSend.set('genres', formData.genres.join(','));
      formDataToSend.set('description', formData.description);
      
      // Add thumbnail file
      if (formData.thumbnail) {
        formDataToSend.set('thumbnail', formData.thumbnail);
      }

      const result = await createStory(formDataToSend);
      
      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message });
        // Reset form
        setFormData({
          name: '',
          author: '',
          status: '',
          genres: [],
          description: '',
          thumbnail: null,
        });
        setTouched({});
        setErrors({});
        
        // Reload stories list
        const storiesResult = await getUserStories();
        if (storiesResult.success) {
          setUserStories(storiesResult.stories);
        }
      } else {
        setSubmitMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
      });
    } finally {
      setIsSubmitting(false);
    }
  }



  // Show loading state
  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </main>
    );
  }

  // Show login prompt if not authenticated
  if (!session) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Yêu cầu đăng nhập
            </h2>
            <p className="text-muted-foreground mb-6">
              Bạn cần đăng nhập để đăng truyện và quản lý nội dung của mình
            </p>
            <LoginDialog />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* New Comic Form */}
        <div className="mb-16">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
              Đăng truyện mới
            </h1>
            <p className="text-base text-muted-foreground">
              Tạo truyện mới và bắt đầu chia sẻ nội dung của bạn
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Thông tin cơ bản
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Comic Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-foreground">
                        Tên truyện <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value })
                          if (touched.name) {
                            setErrors((err) => ({ ...err, name: validateName(e.target.value) }))
                          }
                        }}
                        onBlur={() => handleFieldBlur("name")}
                        placeholder="Nhập tên truyện"
                        className={`rounded-lg border transition-colors duration-200 
                          ${touched.name && errors.name 
                            ? "border-destructive focus:border-destructive focus:ring-destructive" 
                            : "border-border focus:border-primary focus:ring-primary"
                          }`}
                      />
                      {touched.name && errors.name && (
                        <div className="flex items-start gap-2 text-sm text-destructive">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{errors.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Author Name */}
                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-sm font-medium text-foreground">
                        Tác giả <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => {
                          setFormData({ ...formData, author: e.target.value })
                          if (touched.author) {
                            setErrors((err) => ({ ...err, author: validateAuthor(e.target.value) }))
                          }
                        }}
                        onBlur={() => handleFieldBlur("author")}
                        placeholder="Nhập tên tác giả"
                        className={`rounded-lg border transition-colors duration-200 
                          ${touched.author && errors.author 
                            ? "border-destructive focus:border-destructive focus:ring-destructive" 
                            : "border-border focus:border-primary focus:ring-primary"
                          }`}
                      />
                      {touched.author && errors.author && (
                        <div className="flex items-start gap-2 text-sm text-destructive">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{errors.author}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-foreground">
                      Trạng thái <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => {
                        setFormData({ ...formData, status: value })
                        setTouched((t) => ({ ...t, status: true }))
                        setErrors((err) => ({ ...err, status: validateStatus(value) }))
                      }}
                    >
                      <SelectTrigger 
                        className={`rounded-lg border transition-colors duration-200 
                          ${touched.status && errors.status 
                            ? "border-destructive focus:border-destructive focus:ring-destructive" 
                            : "border-border focus:border-primary focus:ring-primary"
                          }`}
                      >
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Đang tiến hành</SelectItem>
                        <SelectItem value="completed">Đã hoàn thành</SelectItem>
                      </SelectContent>
                    </Select>
                    {touched.status && errors.status && (
                      <div className="flex items-start gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{errors.status}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Genre Multi-select */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Thể loại <span className="text-destructive">*</span>
                  </h2>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {genres.map((genre) => {
                      const isSelected = formData.genres.includes(genre)
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => {
                            toggleGenre(genre)
                            setTouched((t) => ({ ...t, genres: true }))
                          }}
                          className={`px-4 py-2.5 rounded-lg border text-sm font-medium 
                            transition-all duration-200 cursor-pointer flex items-center justify-center gap-2
                            ${isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-background hover:bg-secondary hover:border-primary/50 border-border"
                            }`}
                        >
                          {isSelected && <Check className="w-4 h-4" />}
                          {genre}
                        </button>
                      )
                    })}
                  </div>

                  {formData.genres.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Đã chọn: {formData.genres.join(", ")} ({formData.genres.length}/5)
                    </p>
                  )}

                  {touched.genres && errors.genres && (
                    <div className="flex items-start gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{errors.genres}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Mô tả truyện <span className="text-destructive">*</span>
                  </h2>
                  
                  <div className="space-y-2">
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value })
                        if (touched.description) {
                          setErrors((err) => ({ ...err, description: validateDescription(e.target.value) }))
                        }
                      }}
                      onBlur={() => handleFieldBlur("description")}
                      placeholder="Nhập mô tả chi tiết về truyện của bạn (ít nhất 50 ký tự)"
                      rows={6}
                      className={`rounded-lg border transition-colors duration-200 resize-none
                        ${touched.description && errors.description 
                          ? "border-destructive focus:border-destructive focus:ring-destructive" 
                          : "border-border focus:border-primary focus:ring-primary"
                        }`}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Tối thiểu 50 ký tự</span>
                      <span className={formData.description.length > 1000 ? "text-destructive" : ""}>
                        {formData.description.length}/1000
                      </span>
                    </div>
                    {touched.description && errors.description && (
                      <div className="flex items-start gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{errors.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Ảnh đại diện truyện <span className="text-destructive">*</span>
                  </h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail" className="text-sm font-medium text-foreground">
                      Chọn ảnh (JPG, PNG, WEBP - Tối đa 5MB)
                    </Label>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] || null;
                        
                        if (file) {
                          // Compress thumbnail on client
                          const compressedFile = await compressImage(file, {
                            maxSizeMB: 0.5, // 500KB for thumbnail
                            maxWidthOrHeight: 800,
                          });
                          setFormData({ ...formData, thumbnail: compressedFile });
                          if (touched.thumbnail) {
                            setErrors((err) => ({ ...err, thumbnail: validateThumbnail(compressedFile) }));
                          }
                        } else {
                          setFormData({ ...formData, thumbnail: null });
                        }
                      }}
                      onBlur={() => handleFieldBlur("thumbnail")}
                      className={`rounded-lg border transition-colors duration-200 cursor-pointer
                        ${touched.thumbnail && errors.thumbnail 
                          ? "border-destructive focus:border-destructive focus:ring-destructive" 
                          : "border-border focus:border-primary focus:ring-primary"
                        }`}
                    />
                    
                    {/* Preview thumbnail */}
                    {formData.thumbnail && (
                      <div className="mt-3 flex items-start gap-3">
                        <div className="relative w-32 h-40 rounded-lg overflow-hidden border border-border">
                          <Image
                            src={URL.createObjectURL(formData.thumbnail)}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">{formData.thumbnail.name}</p>
                          <p>{(formData.thumbnail.size / 1024 / 1024).toFixed(2)} MB</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormData({ ...formData, thumbnail: null });
                              setErrors((err) => ({ ...err, thumbnail: validateThumbnail(null) }));
                            }}
                            className="mt-2"
                          >
                            Xóa ảnh
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {touched.thumbnail && errors.thumbnail && (
                      <div className="flex items-start gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{errors.thumbnail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    disabled={isSubmitting}
                    className="order-2 sm:order-1 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="order-1 sm:order-2 sm:ml-auto w-full sm:w-auto bg-primary text-primary-foreground 
                      rounded-lg px-8 py-6 text-base font-medium transition-colors duration-200 cursor-pointer 
                      hover:opacity-90 disabled:opacity-50"
                  >
                    <BookPlus className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Đang xử lý...' : 'Đăng truyện'}
                  </Button>
                </div>

                {/* Submit Message */}
                {submitMessage && (
                  <div
                    className={`p-4 rounded-lg border ${
                      submitMessage.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {submitMessage.text}
                  </div>
                )}
              </form>
            </div>
        </div>        {/* User's Posted Comics */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Truyện của tôi
            </h2>
            <p className="text-base text-muted-foreground">
              Quản lý các truyện bạn đã đăng tải
            </p>
          </div>

          {isLoadingStories ? (
            <div className="text-center py-12 text-muted-foreground">
              Đang tải truyện...
            </div>
          ) : userStories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Bạn chưa đăng truyện nào. Hãy đăng truyện đầu tiên!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {userStories.map((story) => (
                <Link 
                  key={story.id} 
                  href={`/truyen/dang-chap-truyen/${story.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-smooth overflow-hidden">
                    {/* Cover Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <Image
                        src={story.thumbnailUrl || "/images/daicongtu.jfif"}
                        alt={story.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-3 space-y-1.5">
                      <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug 
                        group-hover:text-primary transition-colors duration-200 min-h-[2.5rem]">
                        {story.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {story.chapterCount} chương
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
