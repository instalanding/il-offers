import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Open_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from 'next/dynamic';

// Configure the font with display swap for better performance
const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true, // Ensure font is preloaded
  fallback: ['system-ui', 'arial', 'sans-serif'], // Fallback fonts
  variable: '--font-open-sans', // Use CSS variable for the font
});

// Enhanced preconnect list with prioritized domains based on critical resources
const PRECONNECT_DOMAINS = [
  // Image hosting (prioritized)
  'https://res.cloudinary.com',
  'https://cdn.cloudinary.com',
  
  // Font providers
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  
  // CSS frameworks
  'https://cdn.tailwindcss.com',
  
  // Icon libraries
  'https://use.fontawesome.com',
  
  // Client domains (prioritized for faster redirects/API calls)
  'https://buynow.saptamveda.com',
  'https://il-offers.vercel.app',
  'https://staging-il-offers.vercel.app',
  'https://preprod-il-offers.vercel.app',
  'https://www.cureveda.com',
  'https://www.saptamveda.com',
  'https://shopnow.cureveda.com',
  'https://shop.krishnaayurveda.com',
  
  // Analytics
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  
  // API domains (if different from app domain)
  'https://api.instalanding.shop'
];

// Prioritized resources to preload
const CRITICAL_RESOURCES = [
  { href: '/globals.css', as: 'style' },
  // Add fonts or other critical resources here
];

export const metadata: Metadata = {
  title: 'Instalanding',
  description: 'Better shopping experience with Instalanding',
  metadataBase: new URL('https://instalanding.shop'),
  openGraph: {
    title: 'Instalanding',
    description: 'Better shopping experience with Instalanding',
    url: 'https://instalanding.shop',
    siteName: 'Instalanding',
    type: 'website',
  }
};

// Import PerformanceMonitor only on client-side
const PerformanceMonitor = dynamic(() => import('../components/PerformanceMonitor'), { 
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.variable}>
      <head>
        {/* Critical Resource Hints (High Priority) */}
        {PRECONNECT_DOMAINS.slice(0, 2).map((domain, index) => (
          <link key={`high-priority-preconnect-${index}`} rel="preconnect" href={domain} crossOrigin="anonymous" />
        ))}
        
        {/* Preload Critical Resources */}
        {CRITICAL_RESOURCES.map((resource, index) => (
          <link key={`preload-${index}`} rel="preload" href={resource.href} as={resource.as} />
        ))}
        
        {/* Secondary Preconnects (Lower Priority) */}
        {PRECONNECT_DOMAINS.slice(2).map((domain, index) => (
          <link key={`preconnect-${index}`} rel="preconnect" href={domain} crossOrigin="anonymous" />
        ))}
        
        {/* DNS Prefetch for all domains (fallback for older browsers) */}
        {PRECONNECT_DOMAINS.map((domain, index) => (
          <link key={`dns-prefetch-${index}`} rel="dns-prefetch" href={domain} />
        ))}
        
        {/* Preload Font CSS as it's critical for rendering */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap" 
          as="style" 
        />
        
        {/* Resource Hints for Performance */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body className="font-sans">
        <Toaster />
        <Providers>
          {children}
        </Providers>
        <PerformanceMonitor />
      </body>
    </html>
  );
}