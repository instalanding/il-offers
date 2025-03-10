'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  id?: string;
  element?: HTMLElement;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<Record<string, PerformanceMetric>>({});
  const [lcpElement, setLcpElement] = useState<string | null>(null);
  const [lcpImageUrl, setLcpImageUrl] = useState<string | null>(null);
  const [slowResources, setSlowResources] = useState<{url: string, time: number}[]>([]);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get network info
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
      }
    }
    
    // Track LCP
    if ('PerformanceObserver' in window) {
      try {
        // Observer for LCP
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            const lcpValue = Math.round(lastEntry.startTime);
            
            // Log the LCP time
            console.log(`Performance Metric: LCP`, {
              name: 'LCP',
              value: lcpValue,
              id: (lastEntry as any).element?.tagName || 'Unknown',
            });
            
            // Extract the element info
            const element = (lastEntry as any).element;
            if (element) {
              setLcpElement(element.tagName + (element.id ? `#${element.id}` : ''));
              
              // If it's an image, get the URL
              if (element.tagName === 'IMG') {
                setLcpImageUrl(element.src);
              }
            }
            
            // Store the metric
            setMetrics(prev => ({
              ...prev,
              LCP: {
                name: 'LCP',
                value: lcpValue,
                id: (lastEntry as any).element?.tagName || 'Unknown',
                element: (lastEntry as any).element,
              }
            }));
          }
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Observer for CLS
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          entryList.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          clsValue = Math.round(clsValue * 100) / 100;
          console.log(`Performance Metric: CLS`, {
            name: 'CLS',
            value: clsValue,
          });
          
          setMetrics(prev => ({
            ...prev,
            CLS: {
              name: 'CLS',
              value: clsValue,
            }
          }));
        });
        
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        
        // Monitor slow resources
        const resourceObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const slowOnes = entries
            .filter((entry: any) => entry.duration > 300 && entry.initiatorType !== 'beacon')
            .sort((a: any, b: any) => b.duration - a.duration)
            .slice(0, 5)
            .map((entry: any) => ({
              url: entry.name.split('/').pop() || entry.name,
              time: Math.round(entry.duration),
              type: entry.initiatorType
            }));
            
          if (slowOnes.length > 0) {
            setSlowResources(slowOnes);
          }
        });
        
        resourceObserver.observe({ type: 'resource', buffered: true });
        
        // Track when everything is loaded
        window.addEventListener('load', () => {
          if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Total page load time: ${pageLoadTime}ms`);
          }
          
          // Check for potential LCP bottlenecks
          setTimeout(() => {
            const lcpMetric = metrics.LCP;
            if (lcpMetric && lcpMetric.value > 2500) {
              setShowRecommendations(true);
            }
          }, 1000);
        });
        
        return () => {
          lcpObserver.disconnect();
          clsObserver.disconnect();
          resourceObserver.disconnect();
        };
      } catch (error) {
        console.error("Error setting up performance observers", error);
      }
    }
  }, []);
  
  // Only render in development or with ?debug=true
  if (
    typeof window === 'undefined' || 
    (process.env.NODE_ENV !== 'development' && 
     !window.location.search.includes('debug=true'))
  ) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg shadow-xl z-50 text-xs max-w-sm">
      <h3 className="font-bold mb-2 text-sm">Performance Metrics</h3>
      
      <div className="space-y-1.5">
        {metrics.LCP && (
          <div className={`flex justify-between ${metrics.LCP.value > 2500 ? 'text-red-400' : metrics.LCP.value > 1800 ? 'text-yellow-400' : 'text-green-400'}`}>
            <span>LCP:</span>
            <span>{metrics.LCP.value}ms ({metrics.LCP.id})</span>
          </div>
        )}
        
        {metrics.CLS && (
          <div className={`flex justify-between ${metrics.CLS.value > 0.1 ? 'text-red-400' : metrics.CLS.value > 0.05 ? 'text-yellow-400' : 'text-green-400'}`}>
            <span>CLS:</span>
            <span>{metrics.CLS.value}</span>
          </div>
        )}
        
        {lcpElement && (
          <div className="text-gray-300 mt-2 text-[10px] break-words">
            <div>LCP Element: <span className="font-mono">{lcpElement}</span></div>
            {lcpImageUrl && <div>URL: <span className="font-mono truncate block">{lcpImageUrl.split('/').pop()}</span></div>}
          </div>
        )}
      </div>
      
      {showRecommendations && metrics.LCP?.value > 2500 && (
        <div className="mt-3 border-t border-gray-600 pt-2">
          <h4 className="font-bold text-yellow-400">Recommendations:</h4>
          <ul className="text-gray-300 list-disc pl-4 mt-1 text-[10px]">
            <li>Use &lt;link rel="preload"&gt; for the LCP image</li>
            <li>Set fetchPriority="high" on LCP image</li>
            <li>Optimize image size and format</li>
            <li>Reduce render-blocking resources</li>
          </ul>
        </div>
      )}
      
      {slowResources.length > 0 && (
        <div className="mt-3 border-t border-gray-600 pt-2">
          <h4 className="font-bold">Slow Resources:</h4>
          <div className="max-h-20 overflow-y-auto text-[10px]">
            {slowResources.map((res, i) => (
              <div key={i} className="flex justify-between text-gray-300">
                <span className="truncate max-w-[120px]">{res.url}</span>
                <span className="text-yellow-400">{res.time}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {networkInfo && (
        <div className="mt-2 text-[10px] text-gray-400">
          Network: {networkInfo.effectiveType} ({networkInfo.downlink}Mbps, {networkInfo.rtt}ms RTT)
          {networkInfo.saveData && <span className="ml-1 text-yellow-400">Save-Data</span>}
        </div>
      )}
      
      <div className="mt-3 text-center text-[10px] text-gray-500">Add ?debug=true to show in production</div>
    </div>
  );
}