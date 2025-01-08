import { useEffect } from 'react';
import axios from 'axios';

interface FontItem {
    family: string;
    // Add other properties if needed, e.g., variants, category, etc.
}

const useFetchGoogleFonts = () => {
    const loadFonts = async (fontFamily: string) => {
        try {
            const { data } = await axios.get(
                'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAotllBCW0WwZ_0RSMLBAbUOH4CWE17h0s&sort=popularity'
            );
            if (data.items) {
                const font = data.items.find((item: FontItem) => item.family === fontFamily);
                if (font) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400&display=swap`;
                    document.head.appendChild(link);
                }
            }
        } catch (error) {
            console.error('Error fetching Google Fonts:', error);
        }
    };

    return { loadFonts };
};

export default useFetchGoogleFonts; 