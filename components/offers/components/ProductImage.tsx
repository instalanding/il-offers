'use client';

import { useState, useEffect, useRef } from 'react';
import { optimizeCloudinaryUrl, generateImageSrcSet } from '@/utils/imageUtils';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  isLCP?: boolean; // Flag to indicate this is the LCP image
}

/**
 * Optimized product image component with built-in performance tracking
 */
export function ProductImage({
  src,
  alt,
  width = 800,
  height = 800,
  className = '',
  isLCP = false
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const startTimeRef = useRef<number>(performance.now());
  const prevSrcRef = useRef<string>(src);
  
  // Reset state when src changes
  useEffect(() => {
    if (prevSrcRef.current !== src) {
      setLoaded(false);
      startTimeRef.current = performance.now();
      prevSrcRef.current = src;
    }
  }, [src]);
  
  // Optimize the image URL - memoize to prevent recalculation on every render
  const optimizedSrc = useRef(optimizeCloudinaryUrl(src, width)).current;
  
  // Generate srcset for responsive images - memoize to prevent recalculation
  const srcSet = useRef(src ? generateImageSrcSet(src) : '').current;
  
  useEffect(() => {
    // Don't set up observers if not in browser or no imageRef
    if (typeof window === 'undefined' || !imageRef.current) return;
    
    // Add LCP tracking entry marker if this is an LCP image
    if (isLCP && 'PerformanceObserver' in window) {
      try {
        // Mark the element for LCP tracking
        imageRef.current.setAttribute('data-lcp', 'true');

        // Initialize PerformanceObserver
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const lcpEntry = entries[entries.length - 1];
            
            // Only log if our image is the LCP element
            const lcpElement = (lcpEntry as any).element;
            if (lcpElement && lcpElement === imageRef.current) {
              const loadTime = Math.round(lcpEntry.startTime);
              console.log(`LCP Image loaded in ${loadTime}ms`);
              
              // Report to analytics if needed
              if (window.gtag) {
                window.gtag('event', 'web_vitals', {
                  event_category: 'Web Vitals',
                  event_label: 'LCP',
                  value: loadTime,
                  non_interaction: true,
                });
              }
            }
          }
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        
        return () => {
          lcpObserver.disconnect();
        };
      } catch (error) {
        console.error('Error tracking LCP:', error);
      }
    }
  }, [isLCP]); // Only trigger when isLCP changes
  
  // Track image load time - using event handler to avoid state updates in render
  const handleLoad = () => {
    // Don't update state if already loaded (prevents double updates)
    if (loaded) return;
    
    const loadTime = performance.now() - startTimeRef.current;
    if (isLCP) {
      console.log(`Product image loaded in ${Math.round(loadTime)}ms`);
    }
    setLoaded(true);
  };
  
  return (
    <div className={`relative ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${className}`}>
      {/* Blurred placeholder (optional) */}
      {!loaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse" 
          style={{ aspectRatio: width / height }}
        />
      )}
      
      <img
        ref={imageRef}
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px`}
        alt={alt}
        width={width}
        height={height}
        loading={isLCP ? "eager" : "lazy"}
        decoding={isLCP ? "sync" : "async"}
        onLoad={handleLoad}
        fetchPriority={isLCP ? "high" : "auto"}
        style={{ 
          width: '100%', 
          height: 'auto',
          maxWidth: '100%',
          objectFit: 'contain'
        }}
        className={`w-full h-auto max-w-full ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  );
} 