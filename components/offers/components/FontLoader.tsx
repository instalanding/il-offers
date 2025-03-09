"use client";
import React, { useEffect } from "react";
import useFetchGoogleFonts from "@/hooks/useFetchGoogleFonts";

const FontLoader = ({ fontFamily }: { fontFamily: string }) => {
    const { loadFonts } = useFetchGoogleFonts();

    useEffect(() => {
        if (fontFamily) {
            loadFonts(fontFamily);
        }
    }, [fontFamily, loadFonts]);

    return null; // This component does not render anything
};

export default FontLoader; 