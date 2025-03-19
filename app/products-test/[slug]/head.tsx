import React from 'react';

/**
 * Custom head for product pages
 * Adds optimized performance hints for faster rendering
 */
export default function ProductHead() {
  return (
    <>
      {/* High-priority resource hints for LCP - applied globally to product pages */}
      <meta name="theme-color" content="#ffffff" />
      
      {/* Preload critical resources for LCP */}
      <link 
        rel="preconnect" 
        href="https://res.cloudinary.com" 
        crossOrigin="anonymous"
        fetchPriority="high"
      />
      
      {/* Instruct browser about image prioritization */}
      <meta 
        httpEquiv="Priority" 
        content="High" 
      />
      
      {/* Instruct browser about resource prioritization */}
      <meta 
        name="resource-priorities" 
        content="hero-image:has-high-priority" 
      />
      
      {/* Inform the browser about responsive image sizes used in this page */}
      <meta 
        name="viewport" 
        content="width=device-width, initial-scale=1, viewport-fit=cover" 
      />
    </>
  );
} 