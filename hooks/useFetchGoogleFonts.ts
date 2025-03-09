import { useCallback } from 'react';

// Set to track which fonts have already been loaded to prevent duplicates
const loadedFonts = new Set<string>();

// System font list to skip loading
const systemFonts = [
  'system-ui', 
  'sans-serif', 
  'serif', 
  '-apple-system', 
  'BlinkMacSystemFont', 
  'Segoe UI', 
  'Roboto', 
  'Arial', 
  'Helvetica'
];

const useFetchGoogleFonts = () => {
    const loadFonts = useCallback(async (fontFamily: string) => {
        // Skip if font is already loaded, if we're on the server,
        // or if it's a system font
        if (
            loadedFonts.has(fontFamily) || 
            typeof window === 'undefined' ||
            systemFonts.some(font => fontFamily.includes(font))
        ) {
            return;
        }

        try {
            // Mark this font as loaded to prevent duplicate loads
            loadedFonts.add(fontFamily);
            
            // Create and append link directly without API call
            const fontName = fontFamily.replace(/\s+/g, '+');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700;800&display=swap`;
            link.setAttribute('data-font', fontFamily);
            
            // Add preload to optimize loading
            link.setAttribute('crossorigin', 'anonymous');
            
            document.head.appendChild(link);
            
            // For development debugging
            if (process.env.NODE_ENV !== 'production') {
                console.log(`Loaded font: ${fontFamily}`);
            }
        } catch (error) {
            console.error('Error loading Google Font:', error);
        }
    }, []);

    return { loadFonts };
};

export default useFetchGoogleFonts; 