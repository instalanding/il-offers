/**
 * Font Optimization Utilities
 * This file contains functions for optimizing font loading to improve LCP performance
 */

// Create a mapping of font family names to their Google Fonts names
export const FONT_FAMILY_MAPPING: Record<string, string> = {
  'Oswald': 'Oswald:wght@400;500;600;700',
  'Roboto': 'Roboto:wght@400;500;700',
  'Open Sans': 'Open+Sans:wght@400;500;600;700',
  'Lato': 'Lato:wght@400;700',
  'Montserrat': 'Montserrat:wght@400;500;600;700',
  'Poppins': 'Poppins:wght@400;500;600;700',
  // Add other fonts your campaigns might use
};

/**
 * Extracts the primary font name from a CSS font-family string
 * @param fontFamily The CSS font-family value (e.g. '"Oswald", sans-serif')
 * @returns The primary font name (e.g. 'Oswald')
 */
export function getFontName(fontFamily: string): string {
  if (!fontFamily) return '';
  // Remove quotes and handle comma-separated fallbacks
  const primaryFont = fontFamily.replace(/["']/g, '').split(',')[0].trim();
  return primaryFont;
}

/**
 * Generates font preload links for metadata
 * @param fontFamily The font family to preload
 * @returns Array of link objects for Next.js metadata
 */
export function generateFontPreloadLinks(fontFamily: string): Array<{
  rel: string;
  href: string;
  as?: string;
  crossOrigin?: string;
}> {
  if (!fontFamily) return [];
  
  const fontName = getFontName(fontFamily);
  const googleFontName = FONT_FAMILY_MAPPING[fontName];
  
  if (!googleFontName) return [];
  
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    {
      rel: 'preload',
      as: 'style',
      href: `https://fonts.googleapis.com/css2?family=${googleFontName}&display=swap`
    }
  ];
}

/**
 * Creates inline font CSS for direct injection into the head
 * @param fontFamily The font family to generate CSS for
 * @returns CSS string for the font
 */
export function generateInlineFontCSS(fontFamily: string): string {
  if (!fontFamily) return '';
  
  const fontName = getFontName(fontFamily);
  const googleFontName = FONT_FAMILY_MAPPING[fontName];
  
  if (!googleFontName) return '';
  
  return `
    /* Font preloading for ${fontName} */
    @import url('https://fonts.googleapis.com/css2?family=${googleFontName}&display=swap');
  `;
}

/**
 * Measures and optimizes font loading performance
 * @param fontFamily The font family to optimize
 */
export function optimizeFontLoading(fontFamily?: string): void {
  if (typeof window === 'undefined' || !fontFamily) return;
  
  // Font loading performance measurement
  const fontName = getFontName(fontFamily);
  
  if (!fontName) return;
  
  // Register a performance mark for font loading start
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('font-loading-start');
  }
  
  // Log font loading start
  console.log(`Font optimization initialized for '${fontName}'`);
} 