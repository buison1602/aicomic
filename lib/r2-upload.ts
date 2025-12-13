import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

// Initialize R2 client for production
function getR2Client() {
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
 * Optimize image with Sharp (server-side compression)
 * @param buffer Image buffer
 * @param options Optimization options
 * @returns Optimized buffer
 */
async function optimizeImage(
  buffer: Buffer,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<Buffer> {
  const { maxWidth = 1920, maxHeight = 1920, quality = 85 } = options;

  try {
    const optimized = await sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality }) // Convert to WebP for better compression
      .toBuffer();

    const originalSize = buffer.length / 1024 / 1024;
    const optimizedSize = optimized.length / 1024 / 1024;
    const reduction = ((1 - optimized.length / buffer.length) * 100).toFixed(1);

    console.log(`   🎨 Sharp optimization:`);
    console.log(`      Original: ${originalSize.toFixed(2)} MB`);
    console.log(`      Optimized: ${optimizedSize.toFixed(2)} MB`);
    console.log(`      Reduction: ${reduction}%`);

    return optimized;
  } catch (error) {
    console.error('❌ Sharp optimization failed:', error);
    return buffer; // Return original if optimization fails
  }
}

/**
 * Upload file to R2 Storage
 * @param file File object from form upload
 * @param key Path where file will be stored (e.g., 'stories/slug/thumbnail.jpg')
 * @returns Public URL of uploaded file
 */
export async function uploadToR2(file: File, key: string): Promise<string> {
  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const originalBuffer = Buffer.from(arrayBuffer);

  console.log(`📸 Processing: ${file.name} (${(originalBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

  // Optimize image with Sharp (server-side)
  const buffer = await optimizeImage(originalBuffer, {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 85,
  });

  // Change extension to .webp since we converted format
  const webpKey = key.replace(/\.(jpg|jpeg|png|jfif)$/i, '.webp');

  // For development: save file to public/uploads/
  if (process.env.NODE_ENV === 'development') {
    console.log('📁 DEV MODE: Saving file locally for:', webpKey);
    
    try {
      // Create directory if not exists
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'stories');
      await mkdir(uploadDir, { recursive: true });
      
      // Save file
      const filename = webpKey.replace('stories/', '');
      const filePath = join(uploadDir, filename.replace(/\//g, '_'));
      await writeFile(filePath, buffer);
      
      // Return local URL
      const localUrl = `/uploads/stories/${filename.replace(/\//g, '_')}`;
      console.log('   ✅ Saved to:', localUrl);
      
      return localUrl;
    } catch (error) {
      console.error('❌ Failed to save file locally:', error);
      // Fallback to placeholder URL
      return `https://dev-placeholder.local/r2/${webpKey}`;
    }
  }

  // For production: actually upload to R2
  try {
    const r2Client = getR2Client();
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('R2_BUCKET_NAME not found in environment variables');
    }

    // Upload to R2 with optimized buffer
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: webpKey,
      Body: buffer,
      ContentType: 'image/webp', // WebP format after optimization
    });

    await r2Client.send(command);

    // Return public URL
    const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${webpKey}`;
    console.log('✅ Uploaded to R2:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('❌ R2 upload failed:', error);
    throw new Error('Failed to upload file to R2 storage');
  }
}

/**
 * Generate storage key for story thumbnail
 * @param slug Story slug (used as folder name)
 * @param filename Original filename
 * @returns Storage key path
 */
export function generateThumbnailKey(slug: string, filename: string): string {
  // Extract file extension
  const ext = filename.split('.').pop() || 'jpg';
  
  // Format: stories/{slug}/thumbnail.{ext}
  return `stories/${slug}/thumbnail.${ext}`;
}

/**
 * Upload multiple chapter page images
 * @param files Array of File objects
 * @param storySlug Story slug
 * @param chapterNumber Chapter number
 * @returns Array of public URLs
 */
export async function uploadChapterImages(
  files: File[],
  storySlug: string,
  chapterNumber: number
): Promise<string[]> {
  const uploadPromises = files.map(async (file, index) => {
    const ext = file.name.split('.').pop() || 'jpg';
    const pageNumber = index + 1;
    
    // Format: stories/{slug}/chapters/{chapter}/page_{number}.{ext}
    const key = `stories/${storySlug}/chapters/${chapterNumber}/page_${pageNumber}.${ext}`;
    
    return uploadToR2(file, key);
  });

  return Promise.all(uploadPromises);
}
