'use client';

import { useEffect, useState } from 'react';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';

interface ImagePreloaderProps {
  // Array of image URLs to preload
  images: string[];
  // If any of these images is particularly important (like LCP image)
  priorityImageIndices?: number[];
  // Callback when all images are preloaded
  onComplete?: () => void;
  // Whether to log preloading progress
  debug?: boolean;
}

/**
 * Preloads important images for faster rendering
 * Works with both client-side and server components
 * Renders nothing visually - just handles the preloading
 */
export default function ImagePreloader({
  images,
  priorityImageIndices = [0], // By default, the first image is a priority
  onComplete,
  debug = false
}: ImagePreloaderProps) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  
  useEffect(() => {
    if (!images || images.length === 0) {
      if (onComplete) onComplete();
      setAllLoaded(true);
      return;
    }
    
    let loadedImages = 0;
    const totalImages = images.length;
    const startTime = performance.now();
    
    // First, handle priority images with higher priority
    priorityImageIndices.forEach((index) => {
      if (index >= 0 && index < images.length) {
        const img = new Image();
        
        // Use high-quality optimized version for priority images
        const url = images[index];
        
        img.onload = () => {
          loadedImages++;
          setLoadedCount(loadedImages);
          
          if (debug) {
            console.log(`Priority image #${index} loaded: ${url}`);
          }
          
          if (loadedImages === totalImages) {
            const totalTime = performance.now() - startTime;
            if (debug) {
              console.log(`All ${totalImages} images preloaded in ${Math.round(totalTime)}ms`);
            }
            if (onComplete) onComplete();
            setAllLoaded(true);
          }
        };
        
        img.onerror = () => {
          loadedImages++;
          setLoadedCount(loadedImages);
          
          if (debug) {
            console.error(`Failed to preload priority image #${index}: ${url}`);
          }
          
          if (loadedImages === totalImages) {
            if (onComplete) onComplete();
            setAllLoaded(true);
          }
        };
        
        // Add fetchpriority hint through attribute to prioritize important images
        img.setAttribute('fetchpriority', 'high');
        img.src = optimizeCloudinaryUrl(url, 800, 85); // Higher quality for priority images
      }
    });
    
    // Then handle the rest of the images
    images.forEach((url, index) => {
      // Skip priority images that we've already handled
      if (priorityImageIndices.includes(index)) {
        return;
      }
      
      const img = new Image();
      
      img.onload = () => {
        loadedImages++;
        setLoadedCount(loadedImages);
        
        if (debug) {
          console.log(`Image #${index} loaded: ${url}`);
        }
        
        if (loadedImages === totalImages) {
          const totalTime = performance.now() - startTime;
          if (debug) {
            console.log(`All ${totalImages} images preloaded in ${Math.round(totalTime)}ms`);
          }
          if (onComplete) onComplete();
          setAllLoaded(true);
        }
      };
      
      img.onerror = () => {
        loadedImages++;
        setLoadedCount(loadedImages);
        
        if (debug) {
          console.error(`Failed to preload image #${index}: ${url}`);
        }
        
        if (loadedImages === totalImages) {
          if (onComplete) onComplete();
          setAllLoaded(true);
        }
      };
      
      // Use lower quality for non-priority images
      img.src = optimizeCloudinaryUrl(url, 400, 70);
    });
    
    return () => {
      // No cleanup needed, but we could cancel requests if needed
    };
  }, [images, priorityImageIndices, onComplete, debug]);
  
  // This component doesn't render anything visible
  return null;
} 