import React from 'react'
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { Button } from '../../ui/button';
import useCheckout from "@/hooks/Checkout";
import { useRouter } from "next/navigation";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";

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
    const { handleCheckout } = useCheckout();
    const router = useRouter();

    const alignmentStyle = {
        display: 'flex',
        justifyContent:
            value.alignment === 'left'
                ? 'flex-start'
                : value.alignment === 'right'
                    ? 'flex-end'
                    : 'center',
    };

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

    const handleCheckoutButtonClick = (e: React.MouseEvent) => {
        try {
            if (checkoutData.checkout_name === "shiprocket" || checkoutData.checkout_name === "fastr" || checkoutData.checkout_name === "fastrr") {
                handleCheckout(
                    e as React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    checkoutData.variant_id,
                    checkoutData.offer_id,
                    checkoutData.coupon_code,
                    checkoutData.utm_params,
                    quantity
                );
            } else if (checkoutData.checkout_name === "shopify") {
                router.push(
                    `https://${checkoutData.store_url}/cart/${checkoutData.variant_id}:${quantity}?discount=${checkoutData.coupon_code}`
                );
            } else {
                router.push(
                    `https://${checkoutData.store_url}/cart/${checkoutData.variant_id}:${quantity}?discount=${checkoutData.coupon_code}`
                );
            }

            recordClicks();
            if (checkoutData.pixel && Array.isArray(checkoutData.pixel)) {
                checkoutData.pixel.forEach((pixelId) => {
                    const noscript = document.createElement("noscript");
                    const img = document.createElement("img");
                    img.height = 1;
                    img.width = 1;
                    img.style.display = "none";
                    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=Checkout&noscript=1`;
                    img.alt = "Facebook Pixel";
                    noscript.appendChild(img);
                    document.body.appendChild(noscript);
                });
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };
    async function recordClicks() {
        try {
            const visitorId = await getVisitorId();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}analytics/clicks/?offer_id=${checkoutData.offer_id}&advertiser_id=${checkoutData.advertiser_id}&user_ip=${checkoutData.userIp}&product_url=${checkoutData.store_url}&visitor_id=${visitorId}&campaign_id=${checkoutData.campaign_id}`,
                {}
            );
        } catch (error) { }
    }

    const isSoldOut = checkoutData.inventory !== undefined && checkoutData.inventory === 0;

    return (
        <>
            <input type="hidden" value={checkoutData.store_url} id="sellerDomain" />

            <div className='flex gap-2 w-full' style={{ ...style, ...alignmentStyle }}>
                {value.quantity && (
                    <div className='flex items-center gap-2 border rounded-lg py-2 px-1 w-auto'>
                        <button
                            onClick={handleDecrease}
                            disabled={quantity === 1}
                            className='disabled:opacity-50'
                        >
                            <IoIosRemove size={18} />
                        </button>
                        <span className='text-lg font-semibold'>{quantity}</span>
                        <button onClick={handleIncrease}>
                            <IoIosAdd size={18} />
                        </button>
                    </div>
                )}
                <div style={{ width: value.width }}>
                    <Button
                        onClick={handleCheckoutButtonClick}
                        disabled={isSoldOut}

                        className={`border flex items-center justify-center text-[18px] gap-2 px-8 py-2 h-full rounded-lg transition-colors w-full ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ backgroundColor: value.color }}
                    >
                        {isSoldOut ? 'Sold Out' : <>{value.buttonText}</>}

                    </Button>
                </div>
            </div>
        </>

    );
}

export default Checkout;