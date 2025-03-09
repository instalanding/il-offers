"use client";
import React, { useEffect } from "react";
import useFetchGoogleFonts from "@/hooks/useFetchGoogleFonts";

const FontLoader = ({ fontFamily }: { fontFamily: string }) => {
    const { loadFonts } = useFetchGoogleFonts();

    useEffect(() => {
        // Only load font if it's a valid font name from the API
        // Skip loading system fonts or empty values
        if (fontFamily && 
            fontFamily !== 'system-ui' && 
            fontFamily !== 'sans-serif' && 
            fontFamily !== 'serif' &&
            !fontFamily.includes('-apple-system') && 
            !fontFamily.includes('BlinkMacSystemFont')
        ) {
            // Use requestIdleCallback for non-critical operations
            if (window.requestIdleCallback) {
                window.requestIdleCallback(() => loadFonts(fontFamily));
            } else {
                // Fallback for browsers that don't support requestIdleCallback
                setTimeout(() => loadFonts(fontFamily), 0);
            }
        }
    }, [fontFamily, loadFonts]);

    return null; // This component does not render anything
};

export default FontLoader; 