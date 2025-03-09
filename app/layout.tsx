import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from 'next/dynamic';

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Instalanding",
  description: "Instalanding offers",
  metadataBase: new URL(`https://instalanding.shop`),
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
    <html lang="en">
      {/* <SpeedInsights/> */}
        {/* <GoogleTagManager gtmId="GTM-P6D6G8DC" /> */}
        <body className={openSans.className}>
          <Toaster />
          {children}
          {/* {process.env.NODE_ENV === 'pre-production' && <PerformanceMonitor />} */}
          {/* <PerformanceMonitor /> */}
        </body>
    </html>
  );
}
