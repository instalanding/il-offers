import React, { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface VariantData {
    label: string;
    price: number;
    originalPrice: number;
    discount: string;
    variant_id?: string;
    product_handle?: string;
    offer_id?: string;
    inventory?: number;
    options: {
        option1?: string;
        option2?: string;
        [key: string]: string | undefined;
    };
}

interface QuantityVariantProps {
    optionKey: string;
    selectedOption: string | null;
    onOptionSelect: (option: string) => void;
    variants: VariantData[];
}

const Quantity: FC<QuantityVariantProps> = ({
    optionKey,
    selectedOption,
    onOptionSelect,
    variants = [],
}) => {
    const router = useRouter();

    const handleVariantClick = (variant: VariantData) => {
        const optionValue = variant.options[optionKey];
        if (optionValue) {
            onOptionSelect(optionValue);
            if (variant.product_handle) {
                router.push(`/products/${variant.product_handle}?variant_id=${variant.variant_id}`);
            } else if (variant.offer_id) {
                router.push(`/${variant.offer_id}`);
            }
        }
    };

    const calculateDiscount = (originalPrice: number, price: number): string => {
        if (originalPrice <= 0 || originalPrice <= price) return "";
        const discount = ((originalPrice - price) / originalPrice) * 100;
        return discount > 0 ? `${Math.round(discount)}% Off` : "";
    };

    const uniqueOptions = Array.from(
        new Set(
            variants
                .map(v => v.options[optionKey])
                .filter((option): option is string => option !== undefined)
        )
    );

    const getVariantForOption = (optionValue: string) =>
        variants.find(v => v.options[optionKey] === optionValue);

    return (
        <div className="w-full mb-4">
            <h3 className="text-sm font-medium mb-2">
                {optionKey === 'option1' ? 'Select a variant' : 'Pick an option'}
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
                {uniqueOptions.map((optionValue, index) => {
                    const variant = getVariantForOption(optionValue);
                    const isSoldOut = variant?.inventory === 0;

                    // Check if original price and offer price are the same
                    const showOriginalPrice = variant && variant.originalPrice > 0 && variant.originalPrice !== variant.price;
                    const discountText = variant?.discount
                        ? `${Math.round(Number(variant.discount))}% Off`
                        : calculateDiscount(variant ? variant.originalPrice : 0, variant ? variant.price : 0);

                    return (
                        <Button
                            key={index}
                            onClick={() => variant && !isSoldOut && handleVariantClick(variant)}
                            disabled={isSoldOut}
                            className={`flex flex-col h-auto relative bg-none text-wrap
                                    snap-start flex-shrink-0 w-[174px] border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer
                                ${isSoldOut
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : selectedOption === optionValue
                                        ? 'border-2 bg-white border-gray-900 text-black hover:bg-gray-100'
                                        : 'bg-white text-black hover:bg-gray-200'
                                }`}
                        >
                            {optionValue}
                            {isSoldOut && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] mt-1 px-1 rounded-full">
                                    Sold Out
                                </span>
                            )}
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-xl font-semibold text-gray-800">
                                    ₹{variant?.price}
                                </span>
                                {showOriginalPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                        ₹{variant?.originalPrice}
                                    </span>
                                )}
                            </div>
                            {discountText && discountText !== "0% Off" && (
                                <p className="text-red-600 text-sm font-medium mt-1">
                                    {discountText}
                                </p>
                            )}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(Quantity);








