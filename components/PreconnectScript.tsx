'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Define all critical domains that need to be preconnected
// The dynamic domains (client specific) will be handled in the preconnectDynamicDomains script
const CRITICAL_DOMAINS = [
  // Cloudinary domains
  'res.cloudinary.com',
  'dnwpamfwv.cloudinary.com',
  'duslrhgcq.cloudinary.com',

  // Font domains
  'fonts.googleapis.com',
  'fonts.gstatic.com',

  // CDN domains
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',

  // Client domains (known ones)
  'www.cureveda.com',
  'www.saptamveda.com',
  'buynow.saptamveda.com',
  'shopnow.cureveda.com',
  'shop.krishnaayurveda.com',

  // App domains
  'il-offers.vercel.app',
  'staging-il-offers.vercel.app',
  'preprod-il-offers.vercel.app',
];

interface PreconnectScriptProps {
  additionalDomains?: string[];
}

export default function PreconnectScript({ additionalDomains = [] }: PreconnectScriptProps) {
  useEffect(() => {
    // Combine standard domains with any additional domains provided
    const allDomains = [...CRITICAL_DOMAINS, ...additionalDomains];
    
    // Only add preconnects for domains not already in the document
    const existingPreconnects = new Set(
      Array.from(document.querySelectorAll('link[rel="preconnect"]'))
        .map(link => link.getAttribute('href'))
        .filter(Boolean)
        .map(href => new URL(href as string).hostname)
    );
    
    // Add preconnect for domains not already preconnected
    allDomains.forEach(domain => {
      if (!existingPreconnects.has(domain)) {
        // Create preconnect
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = `https://${domain.replace(/^https?:\/\//, '')}`;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        
        // Also add dns-prefetch as fallback for browsers that don't support preconnect
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = `https://${domain.replace(/^https?:\/\//, '')}`;
        document.head.appendChild(dnsPrefetch);
      }
    });
    
    // Define a function to detect the current domain context
    const detectDynamicDomains = () => {
      // Function to extract domain from URL
      const extractDomain = (url: string): string | null => {
        if (!url) return null;
        try {
          const urlObj = new URL(url);
          return urlObj.hostname;
        } catch (e) {
          return null;
        }
      };
      
      // Look for links on the page that might refer to client domains
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      const imgSources = Array.from(document.querySelectorAll('img[src]'));
      
      // Collect unique domains from links and images
      const uniqueDomains = new Set<string>();
      
      allLinks.forEach(link => {
        const href = link.getAttribute('href');
        const domain = extractDomain(href || '');
        if (domain && !existingPreconnects.has(domain)) {
          uniqueDomains.add(domain);
        }
      });
      
      imgSources.forEach(img => {
        const src = img.getAttribute('src');
        const domain = extractDomain(src || '');
        if (domain && !existingPreconnects.has(domain)) {
          uniqueDomains.add(domain);
        }
      });
      
      // Preconnect to these discovered domains
      uniqueDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = `https://${domain}`;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };
    
    // Run the dynamic domain detection after a short delay
    // This allows the page to render first before we do this non-critical work
    const timer = setTimeout(detectDynamicDomains, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [additionalDomains]);
  
  return (
    <Script id="connection-optimization" strategy="afterInteractive">
      {`
        (function() {
          // Mark performance timing for connection optimization
          if (performance && performance.mark) {
            performance.mark('connection-optimization-start');
          }
          
          // Function to check if the connection is slow
          function isSlowConnection() {
            if (navigator.connection) {
              // @ts-ignore - navigator.connection is not in all browsers
              const connection = navigator.connection;
              // Detect slow connections (2G, slow-2G, or saveData mode)
              if (connection.effectiveType === '2g' || 
                  connection.effectiveType === 'slow-2g' || 
                  connection.saveData) {
                return true;
              }
              
              // On slow connections, avoid lazy loading critical resources
              if (connection.downlink < 1.0) {
                return true;
              }
            }
            return false;
          }
          
          // Check if we need lower quality images for slow connections
          window.useSlowConnectionSettings = isSlowConnection();
          
          // Update image quality based on connection
          if (window.useSlowConnectionSettings) {
            document.documentElement.classList.add('slow-connection');
            
            // Find all img elements with data-src and update with lower quality
            document.querySelectorAll('img[data-src]').forEach(img => {
              let src = img.getAttribute('data-src');
              if (src && src.includes('cloudinary.com') && src.includes('q_auto')) {
                // Replace with explicit lower quality setting
                src = src.replace('q_auto', 'q_auto:low');
                img.setAttribute('data-src', src);
              }
            });
          }
          
          // Mark performance timing for connection optimization
          if (performance && performance.mark) {
            performance.mark('connection-optimization-end');
            performance.measure('connection-optimization', 
                              'connection-optimization-start', 
                              'connection-optimization-end');
          }
        })();
      `}
    </Script>
  );
} 