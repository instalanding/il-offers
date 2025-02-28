"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

declare const shiprocketCheckoutEvents: any;

export default function useCheckout() {
  const [loaded, setLoaded] = useState(false);
  const searchParams = useSearchParams();

  const utm_medium = searchParams.get("utm_medium");
  const utm_source = searchParams.get("utm_source");
  const utm_campaign = searchParams.get("utm_campaign");
  const utm_term = searchParams.get("utm_term");
  const utm_id = searchParams.get("utm_id");
  const utm_content = searchParams.get("utm_content");

  const loadScripts = () => {
    if (typeof window === "undefined") return; // Ensure it's client-side
    if (loaded) return; // Prevent multiple loads

    // Check if script already exists
    if (!document.querySelector('script[src*="shopify.js"]')) {
      const script = document.createElement("script");
      script.src = "https://fastrr-boost-ui.pickrr.com/assets/js/channels/shopify.js";
      script.async = true;
      script.defer = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    }

    // Check if stylesheet already exists
    if (!document.querySelector('link[href*="shopify.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fastrr-boost-ui.pickrr.com/assets/styles/shopify.css";
      link.onload = () => console.log("Stylesheet loaded");
      document.head.appendChild(link);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it's client-side

    // Use requestIdleCallback to load scripts when the browser is free
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => loadScripts());
    } else {
      // Fallback: Load script after a delay if requestIdleCallback is not supported
      setTimeout(() => loadScripts(), 2000);
    }
  }, []);

  const handleCheckout = async (
    e: React.MouseEvent<HTMLButtonElement>,
    variant_id: string,
    offer_id: string,
    couponCode: string,
    utm_params?: any,
    quantity: number = 1
  ) => {
    e.preventDefault();
    if (loaded) {
      await shiprocketCheckoutEvents.buyDirect({
        type: "cart",
        products: [
          {
            variantId: variant_id || "36289636303004",
            quantity,
          },
        ],
        couponCode: couponCode,
        utmParams: `utm_source=${utm_source || "instalanding"}&utm_medium=${utm_medium || "campaign_instalanding"
          }&utm_campaign=${utm_campaign || offer_id}${utm_term ? `&utm_term=${utm_term}` : ""}${utm_id ? `&utm_id=${utm_id}` : ""
          }${utm_content ? `&utm_content=${utm_content}` : ""}`,
      });
    }
  };

  return { handleCheckout };
}