import React from 'react'
import { formatPrice } from "@/lib/formatUtils";
import { calculatePercentageOff } from '@/lib/calculateDiscount';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { Button } from '@/components/ui/button';
// import useCheckout from '@/hooks/Checkout';
import { Config, Checkout, Price } from '../Footer';


interface FastrrCheckoutProps {
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

const FastrrCheckout = ({
    checkoutData,
    config,
    price,
    quantity,
    handleIncrease,
    handleDecrease,
    roundedOfferPrice,
    isSoldOut,
    recordClicks
}: FastrrCheckoutProps) => {

    // Temporarily mocked functions
    const handleCheckout = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        variant_id: string,
        offer_id: string,
        coupon_code: string,
        utm_params: any,
        quantity: number
    ) => {
        console.log("Checkout triggered", { variant_id, offer_id, coupon_code, utm_params, quantity });
    };

    const handleMouseEnter = () => {
        // Mock function
    };

    const handleTouchStart = () => {
        // Mock function
    };

    const handleCheckoutButtonClick = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        handleCheckout(
            e as React.MouseEvent<HTMLButtonElement, MouseEvent>,
            checkoutData.variant_id,
            checkoutData.offer_id,
            checkoutData.coupon_code,
            checkoutData.utm_params,
            quantity
        );
        recordClicks();
    };
    return (
        <>
            <input type="hidden" value={checkoutData.store_url} id="sellerDomain" />
            <div
                className="sticky bottom-0 bg-gray-100"
                onTouchStart={handleTouchStart}
            >
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
                                onMouseEnter={handleMouseEnter}
                                onTouchStart={handleTouchStart}
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
        </>
    )
}

export default FastrrCheckout 