'use client';

import { useEffect, useState, useRef } from 'react';
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
  const imagesSignatureRef = useRef<string>('');
  const isLoadingRef = useRef<boolean>(false);
  
  // Prevent duplicate preload operations by tracking image signatures
  const getImagesSignature = (imgs: string[]): string => {
    if (!imgs || !imgs.length) return '';
    // Use a simple hash of the first few and last few images to detect changes
    const sample = [...(imgs.slice(0, 2)), ...(imgs.slice(-2))].join('|');
    return sample;
  };
  
  useEffect(() => {
    // Skip if no images or already handled these exact images
    const imagesSignature = getImagesSignature(images);
    if (!images || images.length === 0) {
      if (onComplete && !allLoaded) {
        onComplete();
        setAllLoaded(true);
      }
      return;
    }
    
    // Skip if already loading these same images or already loaded
    if (isLoadingRef.current && imagesSignature === imagesSignatureRef.current) {
      return;
    }
    
    // Reset state for new image set
    if (imagesSignature !== imagesSignatureRef.current) {
      setLoadedCount(0);
      setAllLoaded(false);
      imagesSignatureRef.current = imagesSignature;
      isLoadingRef.current = true;
    }
    
    let loadedImages = 0;
    const totalImages = images.length;
    const startTime = performance.now();
    
    // Use a synchronized counter instead of state updates for each image
    const checkCompletion = () => {
      loadedImages++;
      
      // Update the loadedCount state only occasionally to prevent too many renders
      if (loadedImages % 3 === 0 || loadedImages === totalImages) {
        setLoadedCount(loadedImages);
      }
      
      if (loadedImages === totalImages && !allLoaded) {
        const totalTime = performance.now() - startTime;
        if (debug) {
          console.log(`All ${totalImages} images preloaded in ${Math.round(totalTime)}ms`);
        }
        
        isLoadingRef.current = false;
        setAllLoaded(true);
        
        if (onComplete) {
          // Delay the completion callback slightly to avoid React state batching issues
          setTimeout(() => {
            onComplete();
          }, 0);
        }
      }
    };
    
    // First, handle priority images with higher priority
    const preloadedIndices = new Set<number>();
    
    priorityImageIndices.forEach((index) => {
      if (index >= 0 && index < images.length) {
        preloadedIndices.add(index);
        const img = new Image();
        
        // Use high-quality optimized version for priority images
        const url = images[index];
        
        img.onload = img.onerror = () => {
          checkCompletion();
          
          if (debug && img.onload === img.onerror) {
            console.log(`Priority image #${index} loaded: ${url}`);
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
      if (preloadedIndices.has(index)) {
        return;
      }
      
      const img = new Image();
      
      img.onload = img.onerror = () => {
        checkCompletion();
      };
      
      // Use lower quality for non-priority images
      img.src = optimizeCloudinaryUrl(url, 400, 70);
    });
    
    return () => {
      // No cleanup needed, but we could cancel requests if needed
    };
  }, [images, priorityImageIndices, onComplete, debug, allLoaded]);
  
  // This component doesn't render anything visible
  return null;
} 