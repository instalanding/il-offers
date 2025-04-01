/**
 * Utility functions for optimizing image delivery and loading
 */

/**
 * Optimizes a Cloudinary image URL for fast loading and good quality
 * @param url Original Cloudinary image URL
 * @param width Target width for the image
 * @param quality Quality setting (1-100, default 80)
 * @param format Image format (auto, webp, avif)
 * @returns Optimized image URL
 */
export function optimizeCloudinaryUrl(
  url: string,
  width: number = 800,
  quality: number = 80,
  format: 'auto' | 'webp' | 'avif' = 'auto'
): string {
  if (!url) return '';
  
  // Skip if not a Cloudinary URL
  if (!url.includes('cloudinary.com')) return url;
  
  // Skip if already optimized
  if (url.includes('f_auto') || url.includes('q_auto')) return url;
  
  // Build the transformation string
  const formatParam = format === 'auto' ? 'f_auto' : `f_${format}`;
  const qualityParam = `q_${quality}`;
  const widthParam = `w_${width}`;
  
  // Apply the transformations
  return url.replace('/upload/', `/upload/${formatParam},${qualityParam},${widthParam}/`);
}

/**
 * Generates a complete image srcset for responsive images
 * @param url Base Cloudinary image URL
 * @param sizes Array of image widths to generate
 * @param quality Quality setting (1-100, default 80)
 * @returns SrcSet string for use in <img> or <source> elements
 */
export function generateImageSrcSet(
  url: string,
  sizes: number[] = [320, 640, 960],
  quality: number = 80
): string {
  if (!url) return '';
  
  // Skip if not a Cloudinary URL
  if (!url.includes('cloudinary.com')) return url;
  
  return sizes
    .map(size => {
      const optimizedUrl = optimizeCloudinaryUrl(url, size, quality);
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Optimizes image loading based on network conditions
 * Uses lower quality for slow connections
 * @param url Original image URL
 * @returns Promise that resolves to optimized URL
 */
export async function getNetworkAwareImageUrl(url: string): Promise<string> {
  if (!url) return '';
  
  // Skip if not in browser or not a Cloudinary URL
  if (typeof navigator === 'undefined' || !url.includes('cloudinary.com')) {
    return url;
  }
  
  // Check for slow connection and downgrade quality if needed
  let quality = 80;
  let width = 800;
  
  // Use Network Information API if available
  if ('connection' in navigator && (navigator as any).connection) {
    const connection = (navigator as any).connection;
    
    // Slow 3G or worse
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      quality = 60;
      width = 480;
    }
    // Regular 3G
    else if (connection.effectiveType === '3g') {
      quality = 70;
      width = 640;
    }
    
    // If save-data is enabled, further reduce quality
    if (connection.saveData) {
      quality = Math.min(quality, 50);
      width = Math.min(width, 320);
    }
  }
  
  return optimizeCloudinaryUrl(url, width, quality);
} 