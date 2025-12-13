import imageCompression from 'browser-image-compression';

/**
 * Compress image on client-side before upload
 * @param file Original image file
 * @param options Compression options
 * @returns Compressed file
 */
export async function compressImage(
  file: File,
  options: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
  } = {}
): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 0.8, // Max 800KB per image
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true, // Use web worker for better performance
    fileType: file.type,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    console.log(`🗜️ Compressing ${file.name}...`);
    console.log(`   Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    const compressedFile = await imageCompression(file, mergedOptions);

    console.log(`   Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Reduction: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`);

    return compressedFile;
  } catch (error) {
    console.error('❌ Compression failed:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Compress multiple images in parallel
 * @param files Array of image files
 * @param options Compression options
 * @returns Array of compressed files
 */
export async function compressImages(
  files: File[],
  options?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
  }
): Promise<File[]> {
  console.log(`🗜️ Compressing ${files.length} images...`);
  
  const startTime = Date.now();
  const compressedFiles = await Promise.all(
    files.map(file => compressImage(file, options))
  );
  
  const totalOriginalSize = files.reduce((sum, f) => sum + f.size, 0);
  const totalCompressedSize = compressedFiles.reduce((sum, f) => sum + f.size, 0);
  const duration = Date.now() - startTime;
  
  console.log(`✅ Compressed ${files.length} images in ${duration}ms`);
  console.log(`   Total original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total compressed: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total reduction: ${((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)}%`);
  
  return compressedFiles;
}
