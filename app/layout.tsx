import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Instalanding",
  description: "Instalanding offers",
  metadataBase: new URL(`https://instalanding.shop`),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SpeedInsights/>
        {/* <GoogleTagManager gtmId="GTM-P6D6G8DC" /> */}
        <body className={openSans.className}>
          <Toaster />
          {children}
        </body>
    </html>
  );
}
