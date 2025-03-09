'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  resourceLoad: number | null;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    resourceLoad: null
  });
  
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Toggle visibility with keyboard shortcut (Alt+P)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'p') {
        setShowMonitor(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);

    // Function to send metrics to analytics or console
    const logMetric = (metric: {name: string, value: number, id?: string}) => {
      // Log to console
      console.log(`Performance Metric: ${metric.name}`, metric);
      
      // Update state based on metric type
      switch (metric.name) {
        case 'LCP':
          setMetrics(prev => ({ ...prev, lcp: Math.round(metric.value) }));
          break;
        case 'FID':
          setMetrics(prev => ({ ...prev, fid: Math.round(metric.value) }));
          break;
        case 'CLS':
          setMetrics(prev => ({ ...prev, cls: parseFloat(metric.value.toFixed(3)) }));
          break;
        case 'TTFB':
          setMetrics(prev => ({ ...prev, ttfb: Math.round(metric.value) }));
          break;
        case 'RESOURCE_TIMING':
          setMetrics(prev => ({ ...prev, resourceLoad: Math.round(metric.value) }));
          break;
      }
    };

    // Create observer references
    let lcpObserver: PerformanceObserver | null = null;
    let fidObserver: PerformanceObserver | null = null;
    let clsObserver: PerformanceObserver | null = null;
    let resourceObserver: PerformanceObserver | null = null;

    // Measure TTFB
    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        logMetric({
          name: 'TTFB',
          value: navEntry.responseStart
        });
      }
    } catch (e) {
      console.error('TTFB measurement error:', e);
    }

    // Track LCP
    try {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        // Log LCP
        logMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          id: lastEntry.element ? lastEntry.element.getAttribute('id') || lastEntry.element.tagName : 'unknown'
        });
        
        // Log LCP breakdown components
        if (lastEntry.element && lastEntry.element.tagName === 'IMG') {
          const url = lastEntry.element.src || 'unknown';
          logMetric({
            name: 'LCP_IMAGE',
            value: lastEntry.startTime,
            id: url.split('/').pop() || url
          });
        }
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('LCP Observer error:', e);
    }

    // Track FID
    try {
      fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          logMetric({
            name: 'FID',
            value: (entry as any).processingStart - (entry as any).startTime,
          });
        }
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('FID Observer error:', e);
    }

    // Track CLS
    try {
      let clsValue = 0;
      let clsEntries = [];
      
      clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Only count layout shifts without recent user input
          if (!(entry as any).hadRecentInput) {
            const cls = (entry as any).value;
            clsValue += cls;
            clsEntries.push(entry);
          }
        }
        
        logMetric({
          name: 'CLS',
          value: clsValue,
        });
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('CLS Observer error:', e);
    }

    // Track resource timing for LCP image
    try {
      resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).name.includes('cloudinary') && (entry as any).initiatorType === 'img') {
            logMetric({
              name: 'RESOURCE_TIMING',
              value: (entry as any).responseEnd - (entry as any).startTime,
              id: (entry as any).name
            });
          }
        }
      });
      
      resourceObserver.observe({ type: 'resource', buffered: true });
    } catch (e) {
      console.error('Resource Observer error:', e);
    }

    return () => {
      // Clean up observers when component unmounts
      try {
        if (lcpObserver) lcpObserver.disconnect();
        if (fidObserver) fidObserver.disconnect();
        if (clsObserver) clsObserver.disconnect();
        if (resourceObserver) resourceObserver.disconnect();
        window.removeEventListener('keydown', handleKeyPress);
      } catch (e) {
        console.error('Error disconnecting observers:', e);
      }
    };
  }, []);

  // Return UI only for development environment or if explicitly shown
  if (process.env.NODE_ENV !== 'development' && !showMonitor) return null;
  
  if (!showMonitor) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px',
        borderRadius: '6px',
        fontFamily: 'monospace',
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        userSelect: 'none',
        maxWidth: '260px',
      }}
    >
      <div style={{ 
        marginBottom: '10px', 
        fontWeight: 'bold', 
        borderBottom: '1px solid #555',
        paddingBottom: '6px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Performance Metrics</span>
        <span 
          onClick={() => setShowMonitor(false)}
          style={{ cursor: 'pointer', opacity: 0.7 }}
        >✕</span>
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <span style={{ color: '#75b1ff', display: 'inline-block', width: '50px' }}>LCP:</span> 
        <span style={{ 
          color: metrics.lcp ? (metrics.lcp < 2500 ? '#4ade80' : metrics.lcp < 4000 ? '#fbbf24' : '#f87171') : '#ccc'
        }}>
          {metrics.lcp ? `${metrics.lcp}ms` : 'Measuring...'}
        </span>
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <span style={{ color: '#75b1ff', display: 'inline-block', width: '50px' }}>FID:</span> 
        <span style={{ 
          color: metrics.fid ? (metrics.fid < 100 ? '#4ade80' : metrics.fid < 300 ? '#fbbf24' : '#f87171') : '#ccc'
        }}>
          {metrics.fid ? `${metrics.fid}ms` : 'Measuring...'}
        </span>
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <span style={{ color: '#75b1ff', display: 'inline-block', width: '50px' }}>CLS:</span> 
        <span style={{ 
          color: metrics.cls ? (metrics.cls < 0.1 ? '#4ade80' : metrics.cls < 0.25 ? '#fbbf24' : '#f87171') : '#ccc'
        }}>
          {metrics.cls ?? 'Measuring...'}
        </span>
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <span style={{ color: '#75b1ff', display: 'inline-block', width: '50px' }}>TTFB:</span> 
        <span style={{ 
          color: metrics.ttfb ? (metrics.ttfb < 600 ? '#4ade80' : metrics.ttfb < 1200 ? '#fbbf24' : '#f87171') : '#ccc'
        }}>
          {metrics.ttfb ? `${metrics.ttfb}ms` : 'Measuring...'}
        </span>
      </div>
      
      {metrics.resourceLoad && (
        <div style={{ marginBottom: '6px' }}>
          <span style={{ color: '#75b1ff', display: 'inline-block', width: '50px' }}>Img:</span> 
          <span style={{ 
            color: metrics.resourceLoad < 400 ? '#4ade80' : metrics.resourceLoad < 1000 ? '#fbbf24' : '#f87171'
          }}>
            {`${metrics.resourceLoad}ms`}
          </span>
        </div>
      )}
      
      <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '10px' }}>
        Press Alt+P to toggle this panel
      </div>
    </div>
  );
};

export default PerformanceMonitor;