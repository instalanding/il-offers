"use client";

import { useState, useEffect } from "react";

declare const shiprocketCheckoutEvents: any;

export default function useCheckout() {
  const [loaded, setLoaded] = useState(false);

  const loadScripts = () => {
    console.log("Fastrr Script loaded");
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

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     loadScripts();
  //   }, 3000);
  
    // Cleanup function to clear the timeout if the component unmounts
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    const handleInteraction = () => {
      loadScripts();
      // Remove the event listeners after loading scripts
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  
    document.addEventListener('mousemove', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
  
    // Cleanup function to remove the event listeners
    return () => {
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const handleCheckout = async (
    e: React.MouseEvent<HTMLButtonElement>,
    variant_id: string,
    offer_id: string,
    couponCode: string,
    utm_params:any
  ) => {
    e.preventDefault();

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
        utmParams: `utm_source=${utm_params?.utm_source}&utm_medium=${utm_params?.utm_medium}&utm_campaign=${utm_params?.utm_campaign}`,
      });
      console.log("______checkout_enabled", res);
    }
  };

  return { handleCheckout };
}
