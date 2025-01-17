import React from 'react'
import { TbShoppingBagPlus } from "react-icons/tb";
import { calculateDiscount } from '@/lib/calculateDiscount';
import { formatPrice } from '@/lib/formatUtils';

interface Config {
    primaryColor: string;
    secondaryColor: string;
    footerText: string;
    buttonText: string;
}

interface Price {
    offerPrice: {
        prefix: string;
        value: string;
    },
    originalPrice: {
        prefix: string;
        value: string;
    }
}

const Footer: React.FC<{ config: Config, price: Price }> = ({ config, price }) => {
    return (
        <div className="sticky bottom-0 bg-white">
            <div className="flex flex-col">
                {/* Footer Text */}
                <div
                    style={{
                        backgroundColor: config?.primaryColor + "3a",
                        color: config.secondaryColor || "#000000",
                    }}
                    className="p-1 bg-opacity-25 flex justify-center items-center gap-2"
                >
                    <p className="text-sm text-center">{config.footerText}</p>
                </div>

                {/* Price and Button Section */}
                <div className="flex items-center justify-between text-black p-3 rounded-lg gap-5">
                    {/* Price Section */}
                    <div className="flex items-center justify-center">
                        {price?.offerPrice?.value ? (
                            <div className="flex flex-col gap-1">
                                {price?.originalPrice?.value &&
                                    parseFloat(price.offerPrice.value) <
                                    parseFloat(price.originalPrice.value) ? (
                                    <div className="flex flex-col justify-center items-center">
                                        <p
                                            style={{ color: config?.primaryColor }}
                                            className="font-bold text-[20px] text-center"
                                        >
                                            {formatPrice(parseFloat(price.offerPrice.value), price.offerPrice.prefix)}
                                        </p>
                                        <p className="text-[11px] text-gray-600 line-through">
                                            {formatPrice(parseFloat(price.originalPrice.value), price.originalPrice.prefix)}
                                        </p>
                                        <p className="text-[11px] text-red-600">
                                            {calculateDiscount(
                                                parseFloat(price.originalPrice.value),
                                                parseFloat(price.offerPrice.value)
                                            )}
                                            % off
                                        </p>
                                    </div>
                                ) : (
                                    <p
                                        style={{ color: config?.primaryColor }}
                                        className="text-[20px] font-bold"
                                    >
                                        {formatPrice(parseFloat(price.offerPrice.value), price.offerPrice.prefix)}
                                    </p>
                                )}
                            </div>
                        ) : price?.originalPrice?.value ? (
                            <p className="text-[15px] font-semibold text-green-600">
                                {formatPrice(parseFloat(price.originalPrice.value), price.originalPrice.prefix)}
                            </p>
                        ) : (
                            <p className="text-[15px] text-center text-gray-600">
                                Price not available
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <button
                        className="flex items-center justify-center gap-2 px-8 py-2 bg-black w-full rounded-lg transition-colors"
                        style={{
                            backgroundColor: config.primaryColor,
                            color: config.secondaryColor,
                        }}
                    >
                        <TbShoppingBagPlus size={20} />
                        {config.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Footer;