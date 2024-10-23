"use client";

import { useState } from "react";

declare const shiprocketCheckoutEvents: any;

export default function useCheckout() {
  const [loaded, setLoaded] = useState(false);

  const loadScripts = () => {
    if (loaded) return; // Prevent loading if already loaded

    const script = document.createElement("script");
    script.src = "https://fastrr-boost-ui.pickrr.com/assets/js/channels/shopify.js";
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fastrr-boost-ui.pickrr.com/assets/styles/shopify.css";
    document.head.appendChild(link);
  };

  const handleCheckout = async (
    e: React.MouseEvent<HTMLButtonElement>, // Ensure proper event typing
    variant_id: string,
    offer_id: string,
    couponCode: string
  ) => {
    e.preventDefault(); // Prevent default form submission if needed
    loadScripts(); // Load scripts on checkout button click

    if (loaded) {
      const res = await shiprocketCheckoutEvents.buyDirect({
        type: "cart",
        products: [
          {
            variantId: variant_id || "36289636303004",
            quantity: 1,
          },
        ],
        couponCode: couponCode,
        utmParams: `utm_source=instalanding&utm_medium=${offer_id}&utm_campaign=campaign-instalanding`,
      });
      console.log("______checkout_enabled", res);
    }
  };

  return { handleCheckout };
}
