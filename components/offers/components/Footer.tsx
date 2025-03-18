import React from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import FastrrCheckout from "./Checkouts/Footer/FastrrCheckout";
import ShopifyCheckout from "./Checkouts/Footer/ShopifyCheckout";


export interface Config {
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
  buttonText: string;
}

export interface Price {
  offerPrice: {
    prefix: string;
    value: string;
  };
  originalPrice: {
    prefix: string;
    value: string;
  };
  quantity: boolean;
}

export interface Checkout {
  campaign_id: string;
  variant_id: string;
  offer_id: string;
  store_url: string;
  checkout_name: string;
  userIp: string;
  pixel: string | string[];
  advertiser_id: string;
  coupon_code: string;
  utm_params: Object;
  inventory?: number;
}

const Footer: React.FC<{
  config: Config;
  price: Price;
  checkoutData: Checkout;
  quantity: number;
  handleIncrease: any;
  handleDecrease: any;
}> = ({
  config,
  price,
  quantity,
  handleIncrease,
  handleDecrease,
  checkoutData,
}) => {

    const getVisitorId = async () => {
      if (typeof window === "undefined") return;

      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
      } catch (error) {
        console.error("Error getting visitor identifier:", error);
        return null;
      }
    };

    async function recordClicks() {
      try {
        const visitorId = await getVisitorId();
        const utmParams = checkoutData.utm_params as Record<string, string>;
        const currentUrl = window.location.href;

        const queryParams = new URLSearchParams({
          offer_id: checkoutData.offer_id,
          advertiser_id: checkoutData.advertiser_id,
          user_ip: checkoutData.userIp,
          product_url: currentUrl,
          visitor_id: visitorId || '',
          campaign_id: checkoutData.campaign_id,
          utm_source: utmParams.utm_source || utmParams.source || '',
          utm_medium: utmParams.utm_medium || utmParams.medium || '',
          utm_campaign: utmParams.utm_campaign || utmParams.campaign || ''
        });

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}analytics/clicks/?${queryParams.toString()}`,
          {}
        );
      } catch (error) {
        console.error('Record clicks error:', error);
      }
    }

    const isSoldOut =
      checkoutData.inventory !== undefined && checkoutData.inventory === 0;

    // Round off the offer price for display
    const roundedOfferPrice = price?.offerPrice?.value
      ? Math.round(parseFloat(price.offerPrice.value))
      : 0;


    return (
      checkoutData.checkout_name === "shiprocket" ||
        checkoutData.checkout_name === "fastr" ||
        checkoutData.checkout_name === "fastrr" ?
        <FastrrCheckout
          checkoutData={checkoutData}
          config={config}
          price={price}
          quantity={quantity}
          handleIncrease={handleIncrease}
          handleDecrease={handleDecrease}
          roundedOfferPrice={roundedOfferPrice}
          isSoldOut={isSoldOut}
          recordClicks={recordClicks}
        /> : <ShopifyCheckout
          checkoutData={checkoutData}
          config={config}
          price={price}
          quantity={quantity}
          handleIncrease={handleIncrease}
          handleDecrease={handleDecrease}
          roundedOfferPrice={roundedOfferPrice}
          isSoldOut={isSoldOut}
          recordClicks={recordClicks}
        />
    )


export default Footer;