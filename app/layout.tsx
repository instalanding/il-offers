import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from 'next/dynamic';

// System font stack for fallback
// This ensures good performance without loading any web fonts
const systemFontStack = `
  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
  Helvetica, Arial, sans-serif, "Apple Color Emoji", 
  "Segoe UI Emoji", "Segoe UI Symbol"
`;

export const metadata: Metadata = {
  title: "Instalanding",
  description: "Instalanding offers",
  metadataBase: new URL(`https://instalanding.shop`),
};

// Dynamically import non-critical components
const PerformanceMonitor = dynamic(() => import('../components/PerformanceMonitor'), { 
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add preconnect for external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* DNS prefetch for APIs */}
        <link rel="dns-prefetch" href={process.env.API_URL_V2 || ''} />
        
        {/* Add base system font stack as fallback */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            font-family: ${systemFontStack};
          }
        `}} />
      </head>
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
