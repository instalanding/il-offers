"use client";

import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

declare const shiprocketCheckoutEvents: any;

export default function useCheckout() {
  const [loaded, setLoaded] = useState(false);
  const scriptLoaded = useRef(false); // ✅ Track script load state with ref

  const searchParams = useSearchParams();
  const utm_medium = searchParams.get("utm_medium");
  const utm_source = searchParams.get("utm_source");
  const utm_campaign = searchParams.get("utm_campaign");
  const utm_term = searchParams.get("utm_term");
  const utm_id = searchParams.get("utm_id");
  const utm_content = searchParams.get("utm_content");

  const loadScripts = () => {
    if (typeof window === "undefined") return;
    if (scriptLoaded.current) return; // ✅ Prevent multiple loads

    //console.log("Loading Shiprocket scripts...");
    scriptLoaded.current = true; // ✅ Set ref to true immediately

    // Load script dynamically
    const script = document.createElement("script");
    script.src = "https://fastrr-boost-ui.pickrr.com/assets/js/channels/shopify.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setLoaded(true);
      //console.log("Shiprocket script loaded!");
    };
    document.body.appendChild(script);

    // Load stylesheet dynamically
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fastrr-boost-ui.pickrr.com/assets/styles/shopify.css";
    document.head.appendChild(link);
  };

  const isMobileDevice = () => {
    if (typeof window === "undefined") return false;
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  useEffect(() => {
    if (isMobileDevice()) {
      //console.log("User is on a mobile device, loading scripts...");
      loadScripts();
    }
  }, []);

  const handleMouseEnter = () => {
    if (!loaded) {
      loadScripts();
    }
  };

  const handleTouchStart = () => {
    if (!loaded) {
      loadScripts();
    }
  };



  useEffect(() => {
    setTimeout(() => {
      localStorage.clear();
    }, 30000);
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

    console.log("utm_params", utm_params)

    if (!loaded) {
      //console.log("Script not loaded yet. Loading now...");
      loadScripts();
      setTimeout(() => {
        handleCheckout(e, variant_id, offer_id, couponCode, utm_params, quantity);
      }, 500);// Small delay to ensure script loads
      return;
    }



    await shiprocketCheckoutEvents.buyDirect({
      type: "cart",
      products: [
        {
          variantId: variant_id || "36289636303004",
          quantity,
        },
      ],
      couponCode: couponCode,
      utmParams: `utm_source=${utm_params.utm_source || "instalanding"}&utm_medium=${utm_params.utm_medium || "campaign_instalanding"
        }&utm_campaign=${utm_params.utm_campaign || offer_id}${utm_params.utm_term ? `&utm_term=${utm_params.utm_term}` : ""}${utm_params.utm_id ? `&utm_id=${utm_params.utm_id}` : ""
        }${utm_params.utm_content ? `&utm_content=${utm_params.utm_content}` : ""}`,
    });
  };

  return { handleCheckout, handleMouseEnter, handleTouchStart };
}