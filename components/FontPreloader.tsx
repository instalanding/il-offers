'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Create a mapping of font family names to their Google Fonts names
const FONT_FAMILY_MAPPING: Record<string, string> = {
  'Oswald': 'Oswald:wght@400;500;600;700',
  'Roboto': 'Roboto:wght@400;500;700',
  'Open Sans': 'Open+Sans:wght@400;500;600;700',
  'Lato': 'Lato:wght@400;700',
  'Montserrat': 'Montserrat:wght@400;500;600;700',
  'Poppins': 'Poppins:wght@400;500;600;700',
  'Inter': 'Inter:wght@400;500;600;700',
  // Add other fonts your campaigns might use
};

// Map CSS font-family declarations to actual font names
function getFontName(fontFamily: string): string {
  if (!fontFamily) return '';
  // Remove quotes and handle comma-separated fallbacks
  const primaryFont = fontFamily.replace(/["']/g, '').split(',')[0].trim();
  return primaryFont;
}

interface FontPreloaderProps {
  fontFamily?: string;
}

export default function FontPreloader({ fontFamily }: FontPreloaderProps) {
  useEffect(() => {
    if (!fontFamily) return;
    
    const fontName = getFontName(fontFamily);
    if (!fontName) return;
    
    const fontUrl = FONT_FAMILY_MAPPING[fontName];
    if (!fontUrl) return;
    
    // Log font loading timing
    console.log(`Font preloader initialized for '${fontName}'`);
    const startTime = performance.now();
    
    // Check when fonts are ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const endTime = performance.now();
        console.log(`Fonts loaded in ${Math.round(endTime - startTime)}ms`);
      });
    }
    
    // Add preconnect links programmatically to avoid Next.js warnings
    const preconnectGoogle = document.createElement('link');
    preconnectGoogle.rel = 'preconnect';
    preconnectGoogle.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectGoogle);
    
    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectGstatic);
    
    // Preload the font CSS
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'style';
    preloadLink.href = `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`;
    document.head.appendChild(preloadLink);
    
    // Add the actual stylesheet
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`;
    document.head.appendChild(styleLink);
    
    // Cleanup
    return () => {
      document.head.removeChild(preconnectGoogle);
      document.head.removeChild(preconnectGstatic);
      document.head.removeChild(preloadLink);
      document.head.removeChild(styleLink);
    };
  }, [fontFamily]);
  
  // Also inline the font style in a non-blocking way for faster rendering
  if (!fontFamily) return null;
  
  const fontName = getFontName(fontFamily);
  const fontUrl = FONT_FAMILY_MAPPING[fontName];
  
  if (!fontUrl) return null;
  
  return (
    <>
      <Script id="font-preloader" strategy="afterInteractive">
        {`
          // Inline font loading
          (function() {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap';
            fontLink.media = 'print';
            fontLink.onload = function() {
              fontLink.media = 'all';
            };
            document.head.appendChild(fontLink);
          })();
        `}
      </Script>
    </>
  );
} 