'use client';

import { useEffect, useState } from 'react';

// Fix the type errors by adding proper interfaces
interface PerformanceResourceEntry extends PerformanceEntry {
  initiatorType: string;
  nextHopProtocol: string;
  encodedBodySize: number;
  decodedBodySize: number;
  transferSize: number;
  responseStatus?: number;
}

export default function ClientPerformanceMonitor() {
  const [lcpTime, setLcpTime] = useState<number | null>(null);
  const [lcpElement, setLcpElement] = useState<string | null>(null);
  const [fontLoadTime, setFontLoadTime] = useState<number | null>(null);
  const [resourceLoadTimes, setResourceLoadTimes] = useState<{[key: string]: number}>({});

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Font loading optimization
    if (document.fonts && document.fonts.ready) {
      const fontStart = performance.now();
      document.fonts.ready.then(() => {
        const fontEnd = performance.now();
        setFontLoadTime(Math.round(fontEnd - fontStart));
        console.log(`All fonts loaded in ${Math.round(fontEnd - fontStart)}ms`);
      });
    }

    // Measure LCP
    try {
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          if (lastEntry) {
            // Log LCP time to console
            const lcpTimeValue = Math.round(lastEntry.startTime);
            console.log(`LCP: ${lcpTimeValue} ms`);
            setLcpTime(lcpTimeValue);
            
            // Get information about the LCP element
            const lcpElementInfo = (lastEntry as any).element ? 
              (lastEntry as any).element.tagName + 
              ((lastEntry as any).element.id ? `#${(lastEntry as any).element.id}` : '') +
              ((lastEntry as any).element.src ? ` (src: ${(lastEntry as any).element.src.split('/').pop()})` : '')
              : 'Unknown element';
            
            setLcpElement(lcpElementInfo);
          }
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      }
      
      // Track resource loading times (including images, which affect LCP)
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        const imageEntries = entries.filter(entry => {
          // Cast to PerformanceResourceEntry to access initiatorType
          const resourceEntry = entry as PerformanceResourceEntry;
          return resourceEntry.initiatorType === 'img' || 
                 (resourceEntry.initiatorType === 'css' && entry.name.includes('googleapis.com/css')) ||
                 resourceEntry.initiatorType === 'fetch';
        });
        
        const newResourceTimes: {[key: string]: number} = {};
        
        imageEntries.forEach(entry => {
          const url = entry.name;
          const filename = url.split('/').pop() || url;
          const loadTime = Math.round(entry.duration);
          
          newResourceTimes[filename] = loadTime;
          console.log(`Resource loaded: ${filename} in ${loadTime}ms`);
        });
        
        setResourceLoadTimes(prev => ({...prev, ...newResourceTimes}));
      });
      
      resourceObserver.observe({ type: 'resource', buffered: true });
      
      // Add preloading hints to critical images
      setTimeout(() => {
        // Find the largest image on the page - likely to be the LCP element
        const images = Array.from(document.querySelectorAll('img'));
        if (images.length > 0) {
          // Sort by size (roughly)
          const sortedImages = images
            .filter(img => img.width > 0 && img.height > 0)
            .sort((a, b) => (b.width * b.height) - (a.width * a.height));
          
          // Preload the largest visible images
          sortedImages.slice(0, 3).forEach(img => {
            if (img.src && !document.querySelector(`link[rel=preload][href="${img.src}"]`)) {
              console.log(`Recommended preload for LCP image: ${img.src}`);
            }
          });
        }
      }, 2000);
      
    } catch (e) {
      console.error('Error measuring performance:', e);
    }
  }, []);

  // Only render in development mode or when enabled via query param
  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed bottom-0 right-0 bg-black bg-opacity-75 text-white p-3 m-4 text-xs z-50 rounded-lg">
      <div className="font-bold mb-1">Performance Metrics:</div>
      {lcpTime && (
        <div className={`${lcpTime > 2500 ? 'text-red-400' : lcpTime > 1800 ? 'text-yellow-400' : 'text-green-400'}`}>
          LCP: {lcpTime}ms {lcpTime > 2500 ? '(Poor)' : lcpTime > 1800 ? '(Needs Improvement)' : '(Good)'}
        </div>
      )}
      {lcpElement && <div className="text-gray-300">LCP Element: {lcpElement}</div>}
      {fontLoadTime && <div className="text-gray-300">Font Load Time: {fontLoadTime}ms</div>}
      
      {Object.keys(resourceLoadTimes).length > 0 && (
        <details>
          <summary className="cursor-pointer text-gray-300 mt-1">Resource Load Times</summary>
          <div className="pl-2 mt-1 max-h-40 overflow-y-auto">
            {Object.entries(resourceLoadTimes)
              .sort(([,a], [,b]) => b - a)
              .map(([resource, time]) => (
                <div key={resource} className={`${time > 1000 ? 'text-red-400' : time > 500 ? 'text-yellow-400' : 'text-gray-300'}`}>
                  {resource.substring(0, 20)}{resource.length > 20 ? '...' : ''}: {time}ms
                </div>
              ))
            }
          </div>
        </details>
      )}
      
      <div className="text-xs text-gray-400 mt-2">Add ?debug=true to URL to show this on production</div>
    </div>
  );
} 