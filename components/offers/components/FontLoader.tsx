"use client";
import React from 'react';

interface FontLoaderProps {
  fontFamily: string;
}

// Map of font families to their respective font-display values
const fontDisplayMap: Record<string, string> = {
  'Inter': 'swap',
  'Montserrat': 'swap',
  'Roboto': 'swap',
  'Open Sans': 'swap',
  'Lato': 'swap',
  'Poppins': 'swap',
  // Add more font families as needed
};

const FontLoader: React.FC<FontLoaderProps> = ({ fontFamily }) => {
  const fontDisplay = fontDisplayMap[fontFamily] || 'swap';
  
  // Normalize font family name for Google Fonts URL
  const normalizedFontFamily = fontFamily.replace(/\s+/g, '+');
  
  return (
    <>
      <link 
        rel="preconnect" 
        href="https://fonts.googleapis.com" 
        crossOrigin="anonymous"
      />
      <link 
        rel="preconnect" 
        href="https://fonts.gstatic.com" 
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        as="style"
        href={`https://fonts.googleapis.com/css2?family=${normalizedFontFamily}:wght@400;500;600;700&display=${fontDisplay}`}
      />
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${normalizedFontFamily}:wght@400;500;600;700&display=${fontDisplay}`}
      />
    </>
  );
};

export default FontLoader; 