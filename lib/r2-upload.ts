import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Khởi tạo R2 Client
function getR2Client() {
  // Kiểm tra biến môi trường
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials not found in environment variables');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Hàm upload file lên R2 (Đã bỏ Sharp và fs)
 */
export async function uploadToR2(file: File, key: string): Promise<string> {
  try {
    const r2Client = getR2Client();
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('R2_BUCKET_NAME not found in environment variables');
    }

    // Chuyển File sang Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`📸 Uploading to R2: ${key} (${(buffer.length / 1024).toFixed(2)} KB)`);

    // Upload lên R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'image/jpeg', // Giữ nguyên loại file hoặc mặc định jpg
    });

    await r2Client.send(command);

    // Xử lý public domain (bỏ dấu / ở cuối nếu có)
    let publicDomain = process.env.R2_PUBLIC_DOMAIN || '';
    if (publicDomain.endsWith('/')) {
      publicDomain = publicDomain.slice(0, -1);
    }

    const publicUrl = `${publicDomain}/${key}`;
    console.log('✅ Upload success:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('❌ R2 upload failed:', error);
    throw new Error('Failed to upload file to R2 storage');
  }
}

/**
 * Tạo đường dẫn key cho thumbnail
 */
export function generateThumbnailKey(slug: string, filename: string): string {
  const ext = filename.split('.').pop() || 'jpg';
  return `stories/${slug}/thumbnail.${ext}`;
}

/**
 * Upload danh sách ảnh chương truyện
 */
export async function uploadChapterImages(
  files: File[],
  storySlug: string,
  chapterNumber: number
): Promise<string[]> {
  // Xử lý upload song song (Parallel)
  const uploadPromises = files.map(async (file, index) => {
    const ext = file.name.split('.').pop() || 'jpg';
    const pageNumber = index + 1;
    
    // Format: stories/{slug}/chapters/{chapter}/page_{number}.{ext}
    const key = `stories/${storySlug}/chapters/${chapterNumber}/page_${pageNumber}.${ext}`;
    
    return uploadToR2(file, key);
  });

  return Promise.all(uploadPromises);
}