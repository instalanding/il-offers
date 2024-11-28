"use client";
import React, { useEffect } from "react";
import { platforms } from "@/constants/platforms";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightSLine } from "react-icons/ri";
import useCheckout from "@/hooks/Checkout";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

const CtaButton = ({ offer_id, schema, btn, pixel }: any) => {
  const platform = platforms.find((p) => p.type === btn.type);
  console.log(schema.creative.coupon_code, "schema.creative.coupon_code");

  const searchParams = useSearchParams();

  const utm_medium = searchParams.get("utm_medium") || null;
  const utm_source = searchParams.get("utm_source") || null;
  const utm_campaign = searchParams.get("utm_campaign") || null;

  console.table([utm_medium, utm_source, utm_campaign]);

  function IntentLink({ href, children, target = '_blank' }: any) {
    
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
  
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
      if (/android/i.test(userAgent)) {
        // Android logic (use intent)
        const intentUrl = `intent:${href.replace(
          /^https?:\/\//,
          ''
        )}#Intent;package=com.android.chrome;scheme=https;action=android.intent.action.VIEW;end;`;
        window.location.href = intentUrl;
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        // iOS logic: open in Safari or handle deep linking
        const iosUrl = href.startsWith('http') ? href : `https://${href}`;
        window.location.href = iosUrl; // Opens directly in Safari or default browser
      } else {
        // Web/Desktop logic: open in a new tab
        window.open(href, target, 'noopener,noreferrer');
      }
    };
  

    return (
      <Link href={href} onClick={handleClick} target={target} rel="noopener noreferrer">
        {children}
      </Link>
    );
  }

  return (
    <>
      <IntentLink key={btn._id} href={btn.url} target="_blank">
        <button
          id={btn.pixel_event}
          onClick={(e) => {
            if (
              typeof window !== "undefined" &&
              window.gtag_report_conversion &&
              offer_id === "6a81a"
            ) {
              window.gtag_report_conversion_zomato();
            }
            if (pixel) {
              const noscript = document.createElement("noscript");
              const img = document.createElement("img");

              img.height = 1;
              img.width = 1;
              img.style.display = "none";
              img.src = `https://www.facebook.com/tr?id=${pixel}&ev=${btn.type}ClickedCta&noscript=1`;
              img.alt = "Facebook Pixel";

              noscript.appendChild(img);
              document.body.appendChild(noscript);
            }
            if (btn.pixel) {
              const noscript = document.createElement("noscript");
              const img = document.createElement("img");

              img.height = 1;
              img.width = 1;
              img.style.display = "none";
              img.src = `https://www.facebook.com/tr?id=${btn.pixel}&ev=ClickedCta&noscript=1`;
              img.alt = "Facebook Pixel";

              noscript.appendChild(img);
              document.body.appendChild(noscript);
            }
          }}
          style={{
            display: btn.isVisible ? "" : "none",
            background: btn.type !== "custom" ? platform?.color : btn.color,
            color:
              btn.type === "amazon" ||
                btn.type === "blinkit" ||
                btn.type === "myntra"
                ? "black"
                : btn.type === "custom"
                  ? btn.textColor
                  : "white",
          }}
          className="w-full cursor-pointer rounded-full mt-3 px-3 py-2 flex justify-between items-center hover:transform hover:translate-x-1 transition-transform duration-300"
        >
          <div className="flex items-center gap-4">
            <Image
              alt={`${platform?.title}_logo`}
              src={btn.type === "custom" ? btn.icon : platform?.logo}
              width={50}
              height={50}
              className="w-[50px] h-[50px] object-contain"
            />
            <div className="flex flex-col items-start">
              <p className="font-semibold">{btn?.title}</p>
              <p className="text-xs text-left">
                {btn.subtitle || "Pack of 12 at $2.79"}
              </p>
            </div>
          </div>
          <RiArrowRightSLine
            size={25}
            className="transition-transform duration-300 transform hover:translate-x-2"
          />
        </button>
        </IntentLink>
    </>
  );
};

export default CtaButton;
