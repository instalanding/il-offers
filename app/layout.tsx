import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import FontLoader from "@/components/offers/components/FontLoader";
// import { GoogleTagManager } from "@next/third-parties/google";
// import { Open_Sans } from "next/font/google";

// const openSans = Open_Sans({
//   subsets: ["latin"],
//   display: "swap",
// });

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
      {/* <GoogleTagManager gtmId="GTM-P6D6G8DC" /> */}
      {/* <body className={openSans.className}> */}
      <body>
        <FontLoader fontFamily="Inter" />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
