'use client';

import { useEffect, useState } from 'react';

// Add missing type definitions for Web Vitals API
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface FirstInputDelay extends PerformanceEntry {
  processingStart: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<{
    ttfb: number | null;
    fcp: number | null;
    lcp: number | null;
    cls: number | null;
    fid: number | null;
  }>({
    ttfb: null,
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
  });

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Function to get performance entries by type
    const getPerformanceMetric = (type: string) => {
      const entries = performance.getEntriesByType(type);
      return entries.length > 0 ? entries[0] : null;
    };

    // Calculate TTFB from navigation timing
    const calculateTTFB = () => {
      const navEntry = getPerformanceMetric('navigation') as PerformanceNavigationTiming;
      if (!navEntry) return null;
      
      // TTFB = responseStart - requestStart
      return Math.round(navEntry.responseStart - navEntry.requestStart);
    };

    // Record FCP
    const recordFCP = () => {
      try {
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          setMetrics(prev => ({ ...prev, fcp: Math.round(fcpEntry.startTime) }));
        }
      } catch (e) {
        console.error('Error measuring FCP:', e);
      }
    };

    // PerformanceObserver for LCP
    const lcpObserver = new PerformanceObserver((entries) => {
      const lcpEntry = entries.getEntries().at(-1);
      if (lcpEntry) {
        setMetrics(prev => ({ ...prev, lcp: Math.round(lcpEntry.startTime) }));
      }
    });
    
    // PerformanceObserver for CLS
    const clsObserver = new PerformanceObserver((entries) => {
      let clsScore = 0;
      for (const entry of entries.getEntries()) {
        // Type assertion to LayoutShift
        const layoutShift = entry as LayoutShift;
        if (!layoutShift.hadRecentInput) {
          clsScore += layoutShift.value;
        }
      }
      setMetrics(prev => ({ ...prev, cls: parseFloat(clsScore.toFixed(3)) }));
    });
    
    // PerformanceObserver for FID
    const fidObserver = new PerformanceObserver((entries) => {
      const fidEntry = entries.getEntries()[0] as FirstInputDelay;
      if (fidEntry) {
        setMetrics(prev => ({ ...prev, fid: Math.round(fidEntry.processingStart - fidEntry.startTime) }));
      }
    });

    // Initial TTFB calculation
    const ttfb = calculateTTFB();
    setMetrics(prev => ({ ...prev, ttfb }));

    // Call FCP after a short delay to ensure paint entries are available
    setTimeout(recordFCP, 500);

    // Start observing other metrics
    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('Error setting up performance observers:', e);
    }

    // Cleanup observers on unmount
    return () => {
      lcpObserver.disconnect();
      clsObserver.disconnect();
      fidObserver.disconnect();
    };
  }, []);

  // Only show the component in development mode
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        userSelect: 'none',
      }}
    >
      <div style={{ marginBottom: '8px', fontWeight: 'bold', borderBottom: '1px solid #444', paddingBottom: '4px' }}>
        Performance Metrics
      </div>
      <div>TTFB: {metrics.ttfb !== null ? `${metrics.ttfb}ms` : 'Measuring...'}</div>
      <div>FCP: {metrics.fcp !== null ? `${metrics.fcp}ms` : 'Measuring...'}</div>
      <div>LCP: {metrics.lcp !== null ? `${metrics.lcp}ms` : 'Measuring...'}</div>
      <div>CLS: {metrics.cls !== null ? metrics.cls : 'Measuring...'}</div>
      <div>FID: {metrics.fid !== null ? `${metrics.fid}ms` : 'Measuring...'}</div>
    </div>
  );
}