'use client';

import Script from 'next/script';

const ClientPerformanceScript = () => {
  return (
    <Script
      id="perf-monitor"
      strategy="afterInteractive"
    >
      {`
        // Basic performance monitoring
        if (window.PerformanceObserver) {
          try {
            new PerformanceObserver((list) => {
              const lcpEntry = list.getEntries().at(-1);
              if (lcpEntry) console.log('LCP:', Math.round(lcpEntry.startTime), 'ms');
            }).observe({type: 'largest-contentful-paint', buffered: true});
          } catch(e) {}
        }
      `}
    </Script>
  );
};

export default ClientPerformanceScript; 