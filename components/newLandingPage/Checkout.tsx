"use client";

import useCheckout from "@/hooks/Checkout";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import InstalandingCheckout from "../landingPage/InstalandingCheckout/InstalandingCheckout";
import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Checkout = ({ schema, logo, user_ip }: any) => {
  const { handleCheckout } = useCheckout();
  const [open, setOpen] = useState(false);
  const offerIds = ["8fc08", "be418", "d0f47"];
  const domain = window.location.hostname;
  const router = useRouter();

  console.log("window.location.origin", window.location.origin);
  function calculatePercentageOff(
    originalPrice: number,
    offerPrice: number
  ): number {
    let percentageOff = ((originalPrice - offerPrice) / originalPrice) * 100;
    return Math.round(percentageOff);
  }

  function getCurrentDatePlusDays(daysToAdd: number) {
    // Create a new Date object for the current date
    const currentDate = new Date();

    // Add the desired number of days to the current date
    currentDate.setDate(currentDate.getDate() + daysToAdd);

    // Array of day names and month names for formatting
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the components of the date
    const dayName = dayNames[currentDate.getDay()];
    const monthName = monthNames[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    // Format the date as "Day, Month Day, Year"
    const formattedDate = `${dayName}, ${monthName} ${day}, ${year}`;

    return formattedDate;
  }

  const getVisitorId = async () => {
    if (typeof window === "undefined") return; // Ensure this code only runs on the client side

    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      return result.visitorId;
    } catch (error) {
      console.error("Error getting visitor identifier:", error);
      return null;
    }
  };

  async function recordClicks(
    offer_id: string,
    advertiser: string,
    user_ip: string,
    store_url: string
  ) {
    try {
      const visitorId = await getVisitorId();
      const response = await axios.post(
        `/api/clicks-impressions?offer_id=${offer_id}&advertiser_id=${advertiser}&user_ip=${user_ip}&product_url=${store_url}&visitor_id=${visitorId}`,
        {}
      );
    } catch (error) {}
  }

  return (
    <>
      <input type="hidden" value={schema.store_url} id="sellerDomain" />
      <div className="shadow-new">
        <div className="bg-white">
          {schema.creative.footer_text && (
            <p
              style={{
                backgroundColor: schema.config.backgroundColor + "3a",
              }}
              className="top-0 right-0 text-black text-[12px] p-1 text-center"
            >
              {schema.creative.footer_text}
            </p>
          )}
        </div>
        <div className="flex gap-2 bg-white p-4 items-center ">
          <div className=" flex flex-col">
            <p
              style={{ color: schema.config.backgroundColor }}
              className="font-bold text-[20px] text-center"
            >
              ₹{schema.price.offerPrice.value}
            </p>
            {schema.price.offerPrice.value.toString() !==
              schema.price.originalPrice.value.toString() && (
              <p className="text-slate-500 text-xs cursor-pointer text-center line-through">
                ₹{schema.price.originalPrice.value}
              </p>
            )}
          </div>
          <div className="flex-grow pl-2 flex flex-col">
            {schema.variant_id ? (
              <div className="flex flex-col gap-[5px] justify-end items-center">
                <Button
                  className="w-full text-[16px] h-full"
                  style={{
                    backgroundColor: schema.config.backgroundColor,
                    color: schema.config.textColor,
                  }}
                  onClick={(e) => {
                    if (schema.checkout.checkout_name === "fastr") {
                      handleCheckout(
                        e,
                        schema.variant_id,
                        schema.offer_id,
                        schema.creative.coupon_code
                      );
                    } else if (schema.checkout.checkout_name === "shopify") {
                      router.push(
                        `https://${schema.store_url}/cart/${schema.variant_id}:1`
                      );
                    }
                    recordClicks(
                      schema.offer_id,
                      schema.advertiser,
                      user_ip,
                      "checkout init"
                    );
                    if (schema.pixel) {
                      const noscript = document.createElement("noscript");
                      const img = document.createElement("img");
                      img.height = 1;
                      img.width = 1;
                      img.style.display = "none";
                      img.src = `https://www.facebook.com/tr?id=${schema.pixel.id}&ev=Checkout&noscript=1`;
                      img.alt = "Facebook Pixel";
                      noscript.appendChild(img);
                      document.body.appendChild(noscript);
                      console.log("Checkout");
                    }
                  }}
                >
                  {schema.config.button1Text}
                </Button>
              </div>
            ) : (
              <></>
            )}
            <InstalandingCheckout
              logo={logo}
              schema={schema}
              open={open}
              setOpen={setOpen}
              offer_id={schema.offer_id}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
