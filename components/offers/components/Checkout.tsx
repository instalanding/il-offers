import React from 'react'
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import FastrrCheckout from "./Checkouts/CheckoutBlock/FastrrCheckout";
import ShopifyCheckout from "./Checkouts/CheckoutBlock/ShopifyCheckout";

interface CheckoutComponentProps {
    value: {
        quantity: boolean,
        color: string,
        alignment: string,
        width: string,
        buttonText: string
    },
    style?: React.CSSProperties;
    quantity: number;
    handleIncrease: any;
    handleDecrease: any;
    checkoutData: Checkout;
}

interface Checkout {
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

const Checkout: React.FC<CheckoutComponentProps> = ({ value, style, quantity, handleDecrease, handleIncrease, checkoutData }) => {

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
    const isSoldOut = checkoutData.inventory !== undefined && checkoutData.inventory === 0;

    return (
        <>
            <input type="hidden" value={checkoutData.store_url} id="sellerDomain" />

            {checkoutData.checkout_name === "shiprocket" ||
                checkoutData.checkout_name === "fastr" ||
                checkoutData.checkout_name === "fastrr" ? (
                <FastrrCheckout
                    value={value}
                    style={style}
                    quantity={quantity}
                    handleIncrease={handleIncrease}
                    handleDecrease={handleDecrease}
                    checkoutData={checkoutData}
                    isSoldOut={isSoldOut}
                    recordClicks={recordClicks}
                />
            ) : (
                <ShopifyCheckout
                    value={value}
                    style={style}
                    quantity={quantity}
                    handleIncrease={handleIncrease}
                    handleDecrease={handleDecrease}
                    checkoutData={checkoutData}
                    isSoldOut={isSoldOut}
                    recordClicks={recordClicks}
                />
            )}
        </>
    );
}

export default Checkout;