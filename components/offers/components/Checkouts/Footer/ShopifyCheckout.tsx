import React, { useEffect } from 'react'
import { formatPrice } from "@/lib/formatUtils";
import { calculatePercentageOff } from '@/lib/calculateDiscount';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Checkout, Config, Price } from '../../Footer';

interface ShopifyCheckoutProps {
    checkoutData: Checkout;
    config: Config;
    price: Price;
    quantity: number;
    handleIncrease: () => void;
    handleDecrease: () => void;
    roundedOfferPrice: number;
    isSoldOut: boolean;
    recordClicks: () => void;
}

const ShopifyCheckout = ({
    checkoutData,
    config,
    price,
    quantity,
    handleIncrease,
    handleDecrease,
    roundedOfferPrice,
    isSoldOut,
    recordClicks
}: ShopifyCheckoutProps) => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
          localStorage.clear();
        }, 300000);
      }, []);

    const handleCheckoutButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const params = new URLSearchParams();
        params.append('discount', checkoutData.coupon_code);

        // Add all UTM parameters from checkoutData
        // const utmParams = checkoutData.utm_params as Record<string, string>;

        const utmParams = JSON.parse(localStorage.getItem('utm_params') || '{}');

        Object.entries(utmParams).forEach(([key, value]) => {
            if (value) {
                params.append(key, String(value));
            }
        });

        if (checkoutData.checkout_name === "shopify") {
            router.push(
                `https://${checkoutData.store_url}/cart/${checkoutData.variant_id}:${quantity}?${params.toString()}`
            );
        } else {
            router.push(
                `https://${checkoutData.store_url}/cart/${checkoutData.variant_id}:${quantity}?${params.toString()}`
            );
        }
        recordClicks();
    };

    return (
        <div className="sticky bottom-0 bg-gray-100">
            <div className="flex flex-col">
                <div
                    style={{
                        backgroundColor: config?.primaryColor + "9a",
                        color: config.secondaryColor || "#000000",
                    }}
                    className="p-[1px] shadow-md flex justify-center items-center gap-2"
                >
                    <p className="text-sm text-center">{config.footerText}</p>
                </div>

                {/* Price and Button Section */}
                <div className="flex items-center justify-between text-black p-[10px] rounded-lg gap-2 w-full">
                    <div className="flex items-center justify-center shrink-0 w-auto">
                        {price?.offerPrice?.value ? (
                            <div className="flex flex-col gap-1 px-2">
                                {price?.originalPrice?.value &&
                                    parseFloat(price.offerPrice.value) <
                                    parseFloat(price.originalPrice.value) ? (
                                    <div className="flex flex-col justify-center items-start">
                                        {/* Offer Price on top */}
                                        <p
                                            style={{ color: config?.primaryColor }}
                                            className="font-bold text-[20px] text-center"
                                        >
                                            {formatPrice(
                                                roundedOfferPrice,
                                                price.offerPrice.prefix
                                            )}
                                        </p>
                                        {/* Original Price and Discount in same row below */}
                                        <div className="flex items-center gap-2">
                                            <p className="text-[11px] text-gray-600 line-through">
                                                {formatPrice(
                                                    parseFloat(price.originalPrice.value),
                                                    price.originalPrice.prefix
                                                )}
                                            </p>
                                            <p className="text-[11px] text-red-600">
                                                {calculatePercentageOff(
                                                    parseFloat(price.originalPrice.value),
                                                    parseFloat(price.offerPrice.value)
                                                )}
                                                % off
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p
                                        style={{ color: config?.primaryColor }}
                                        className="text-[20px] font-bold"
                                    >
                                        {formatPrice(
                                            roundedOfferPrice,
                                            price.offerPrice.prefix
                                        )}
                                    </p>
                                )}
                            </div>
                        ) : price?.originalPrice?.value ? (
                            <p className="text-[15px] font-semibold text-green-600">
                                {formatPrice(
                                    parseFloat(price.originalPrice.value),
                                    price.originalPrice.prefix
                                )}
                            </p>
                        ) : (
                            ""
                        )}
                    </div>
                    <div className="flex gap-2">
                        {/* Quantity Selector */}
                        {price.quantity === true && (
                            <div className="flex items-center gap-2 border rounded-lg py-2 px-1 w-auto">
                                <button
                                    onClick={handleDecrease}
                                    disabled={quantity === 1}
                                    className="disabled:opacity-50"
                                >
                                    <IoIosRemove size={18} />
                                </button>
                                <span className="text-lg font-semibold">{quantity}</span>
                                <button onClick={handleIncrease}>
                                    <IoIosAdd size={18} />
                                </button>
                            </div>
                        )}
                        <Button
                            onClick={(e) => {
                                handleCheckoutButtonClick(e);
                            }}
                            disabled={isSoldOut}
                            className={`max-w-[300px] border flex items-center justify-center text-[18px] gap-2 px-8 py-2 h-full flex-1 rounded-lg transition-colors
${isSoldOut ? "opacity-50 cursor-not-allowed" : ""}`}
                            style={{
                                backgroundColor: config.primaryColor,
                                color: config.secondaryColor,
                            }}
                        >
                            {isSoldOut ? "Sold Out" : <>{config.buttonText}</>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopifyCheckout