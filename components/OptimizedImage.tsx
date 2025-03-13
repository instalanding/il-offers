'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width = 480,
  height = 480,
  priority = false,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Optimize the image URL for Cloudinary
  const optimizeCloudinaryUrl = (url: string): string => {
    if (!url) return '';
    
    // Don't process if not a Cloudinary URL
    if (!url.includes('cloudinary.com')) return url;
    
    // Extract the existing transformations if any
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return url;
    
    // Check for connection speed to adjust quality
    const isSlowConnection = typeof window !== 'undefined' && (window as any).useSlowConnectionSettings;
    
    // Use f_auto for format, q_auto for quality, and w_ for width
    // For LCP images, use q_auto:good for better quality
    // For slow connections, use q_auto:low
    const quality = isSlowConnection ? 'q_auto:low' : priority ? 'q_auto:good' : 'q_auto';
    
    // Define transformations based on image priority
    const optimizedTransformations = `f_auto,${quality},w_${width * 2}`;
    
    // Check if there are existing transformations
    if (urlParts[1].includes('/')) {
      // Replace or add our optimizations
      return `${urlParts[0]}/upload/${optimizedTransformations}/${urlParts[1].split('/').pop()}`;
    } else {
      // Add our optimizations
      return `${urlParts[0]}/upload/${optimizedTransformations}/${urlParts[1]}`;
    }
  };
  
  // Optimize the image URL
  const optimizedSrc = optimizeCloudinaryUrl(src);
  
  // Use IntersectionObserver to detect when the image is visible
  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Load images 200px before they come into view
        threshold: 0.01,
      }
    );
    
    observer.observe(imgRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [priority]);
  
  // Mark LCP performance metrics
  useEffect(() => {
    if (priority && loaded) {
      // Report LCP image loaded for performance monitoring
      if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
        window.performance.mark('lcp-image-loaded');
        
        // Log performance metric
        console.log('Performance Metric: LCP_IMAGE', {
          src: optimizedSrc,
          loadTime: performance.now(),
        });
      }
    }
  }, [loaded, priority, optimizedSrc]);
  
  // Define placeholder blur data URL for better loading experience
  const placeholderBlur = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23e2e8f0'/%3E%3C/svg%3E`;
  
  // Use next/image for optimized loading
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${width}/${height}` }}>
      <Image
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        sizes={sizes}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        placeholder="blur"
        blurDataURL={placeholderBlur}
        style={{ objectFit: 'contain' }}
      />
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-500">Image failed to load</span>
        </div>
      )}
    </div>
  );
} 