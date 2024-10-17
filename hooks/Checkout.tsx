"use client";

import { useEffect } from "react";
import { useState } from "react";

declare const shiprocketCheckoutEvents: any;


export default function useCheckout() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://fastrr-boost-ui.pickrr.com/assets/js/channels/shopify.js";
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fastrr-boost-ui.pickrr.com/assets/styles/shopify.css";
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  const handleCheckout = async (variant_id: string, offer_id: string) => {
    if (loaded) {
      const res = await shiprocketCheckoutEvents.buyDirect({
        type: "cart",
        products: [
          {
            variantId: variant_id ? variant_id : "36289636303004",
            quantity: 1
          }
        ],
        couponCode: "SV10",
        utmParams: {
          utm_source: "instalanding",
          utm_medium: offer_id,
          utm_campaign: "campaign-instalanding"
        }
      });
    }
  };

  return { handleCheckout }
}