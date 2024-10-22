"use client";
import React from "react";
import { platforms } from "@/constants/platforms";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightSLine } from "react-icons/ri";
import useCheckout from "@/hooks/Checkout";
import { sendGTMEvent } from '@next/third-parties/google'

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

const CtaButton = ({ offer_id, schema, btn, pixel }: any) => {
  const platform = platforms.find((p) => p.type === btn.type);
  const { handleCheckout } = useCheckout();
  console.log(schema.creative.coupon_code, "schema.creative.coupon_code");
  return (
    <>
      {offer_id === "76faf" ? (
        <>
          {btn.type !== "custom" ? (
            <Link
              key={btn._id}
              href={`https://links.instalanding.in/redirect/?offer_id=${offer_id}&advertiser_id=${schema.advertiser}&tags=${schema?.tags}&redirect_url=${btn.url}&ctatype=${btn.type}`}
              target="_blank"
            >
              <button
                id={btn.pixel_event}
                onClick={() => {
                  if (btn.pixel_event) {
                    const noscript = document.createElement("noscript");
                    const img = document.createElement("img");

                    img.height = 1;
                    img.width = 1;
                    img.style.display = "none";
                    img.src = `https://www.facebook.com/tr?id=${pixel}&ev=${btn.type}ClickedCta&noscript=1`;
                    img.alt = "Facebook Pixel";

                    noscript.appendChild(img);
                    document.body.appendChild(noscript);
                    console.log(btn.pixel_event);
                  }
                }}
                style={{
                  display: btn.isVisible ? "" : "none",
                  background:
                    btn.type !== "custom" ? platform?.color : btn.color,
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
            </Link>
          ) : (
            <>
              <input type="hidden" value="saptamveda.com" id="sellerDomain" />
              <button
                onClick={() =>
                  handleCheckout(
                    schema.variant_id || "",
                    offer_id,
                    schema.creative.coupon_code || ""
                  )
                }
                style={{
                  background:
                    btn.type !== "custom" ? platform?.color : btn.color,
                  color: btn.type === "custom" ? btn.textColor : "white",
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
            </>
          )}
        </>
      ) : (
        <Link
          key={btn._id}
          href={`https://links.instalanding.in/redirect/?offer_id=${offer_id}&advertiser_id=${schema.advertiser}&tags=${schema?.tags}&redirect_url=${btn.url}&ctatype=${btn.type}`}
          target="_blank"
        >
          <button
            id={btn.pixel_event}
            onClick={() => {
              sendGTMEvent({
                event: "conversion", // The event name set in GTM for your conversion tracker
                send_to: "AW-705273883/wouvCP-o5OMBEJvAptAC", // Format for Google Ads conversions
              });
              if (pixel) {
                const noscript = document.createElement("noscript");
                const img = document.createElement("img");

                img.height = 1;
                img.width = 1;
                img.style.display = "none";
                img.src = `https://www.facebook.com/tr?id=${pixel}&ev=${btn.pixel_event}ClickedCta&noscript=1`;
                img.alt = "Facebook Pixel";

                noscript.appendChild(img);
                document.body.appendChild(noscript);
                console.log(btn.pixel_event);
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
        </Link>
      )}
    </>
  );
};

export default CtaButton;
