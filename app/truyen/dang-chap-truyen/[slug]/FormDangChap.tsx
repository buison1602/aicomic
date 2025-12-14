'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Upload, X, ImageIcon } from 'lucide-react';
import { getStoryBySlug, createChapter } from './actions';
import { compressImages } from '@/lib/image-compression';

export default function DangChapTruyenPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [story, setStory] = useState<{
    id: number;
    slug: string;
    title: string;
    thumbnailUrl: string | null;
  } | null>(null);

  const [isLoadingStory, setIsLoadingStory] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<{
    images?: string;
  }>({});

  // Fetch story info
  useEffect(() => {
    async function fetchStory() {
      setIsLoadingStory(true);
      const result = await getStoryBySlug(slug);
      if (result.success && result.story) {
        setStory(result.story);
      } else {
        setSubmitMessage({ type: 'error', text: 'Không tìm thấy truyện' });
      }
      setIsLoadingStory(false);
    }
    fetchStory();
  }, [slug]);

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB per image (before compression)
    
    const invalidFiles = files.filter(
      file => !validTypes.includes(file.type) || file.size > maxSize
    );
    
    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: 'Một số file không hợp lệ (chỉ chấp nhận JPG, PNG, WEBP < 10MB)'
      }));
      return;
    }
    
    // Compress images on client
    setIsCompressing(true);
    setErrors(prev => ({ ...prev, images: undefined }));
    
    console.log(`🔍 Starting compression for ${files.length} files...`);
    
    try {
      const compressedFiles = await compressImages(files, {
        maxSizeMB: 0.3, // Max 300KB each for ~20 images = ~6MB total
        maxWidthOrHeight: 1400, // Optimized for manga/comic pages
      });
      
      console.log('✅ Compression complete!');
      setImages(prev => [...prev, ...compressedFiles]);
    } catch (error) {
      console.error('❌ Compression error:', error);
      // Fallback: use original files
      console.warn('⚠️ Using original files without compression');
      setImages(prev => [...prev, ...files]);
    } finally {
      setIsCompressing(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors = {
      images: images.length === 0 ? 'Vui lòng chọn ít nhất 1 ảnh' : undefined,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== undefined)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const formData = new FormData();
      formData.set('storySlug', slug);
      
      // Add all images
      images.forEach((image) => {
        formData.append('images', image);
      });

      console.log('📤 Sending request to API route...');
      console.log(`Total images: ${images.length}`);
      console.log(`Total payload size: ~${(images.reduce((sum, img) => sum + img.size, 0) / 1024).toFixed(2)}KB`);

      // Use fetch to API route instead of Server Action
      const response = await fetch('/api/upload-chapter', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message });
        // Reset form
        setImages([]);
        setErrors({});
      } else {
        setSubmitMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Đã xảy ra lỗi kết nối',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStory) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-muted-foreground">
            Đang tải thông tin truyện...
          </div>
        </div>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-destructive">
            Không tìm thấy truyện
          </div>
          <div className="text-center">
            <Button onClick={() => router.push('/truyen/dang-truyen')}>
              Quay lại
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Info Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative w-20 h-28 rounded-lg overflow-hidden border border-border flex-shrink-0">
            <Image
              src={story.thumbnailUrl || '/images/daicongtu.jfif'}
              alt={story.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Đăng chương mới
            </h1>
            <p className="text-base text-muted-foreground">
              Truyện: <span className="font-medium text-foreground">{story.title}</span>
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Chương sẽ được đánh số tự động</strong> dựa trên số chương hiện có của truyện.
                Chỉ cần upload ảnh và hệ thống sẽ tự động tạo chương tiếp theo.
              </p>
            </div>

            {/* Images Upload */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-foreground">
                Ảnh truyện <span className="text-destructive">*</span>
              </Label>
              
              {/* Upload Button */}
              <div>
                <label htmlFor="images" className={isCompressing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary hover:bg-secondary/50 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      {isCompressing ? 'Đang nén ảnh...' : 'Click để chọn ảnh'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WEBP (Tối đa 10MB/ảnh - sẽ tự động nén)
                    </p>
                  </div>
                </label>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImagesChange}
                  disabled={isCompressing}
                  className="hidden"
                />
              </div>

              {/* Error */}
              {errors.images && (
                <div className="flex items-start gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errors.images}</span>
                </div>
              )}

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Đã chọn {images.length} ảnh
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Page ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            Trang {index + 1}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
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
                onClick={() => router.push('/truyen/dang-truyen')}
                disabled={isSubmitting}
                className="order-2 sm:order-1 rounded-lg"
              >
                Quay lại
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="order-1 sm:order-2 sm:ml-auto w-full sm:w-auto rounded-lg px-8"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Đang xử lý...' : 'Đăng chương'}
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
      </div>
    </main>
  );
}
