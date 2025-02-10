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

interface OptionVariantProps {
    optionKey: string;
    selectedOption: string | null;
    onOptionSelect: (option: string) => void;
    variants: VariantData[];
    showPrices?: boolean;
}

const OptionVariant: FC<OptionVariantProps> = ({
    optionKey,
    selectedOption,
    onOptionSelect,
    variants = [],
    showPrices = true
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

    // Get unique options for this optionKey
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
            <div className="flex flex-wrap gap-2 justify-center">
                {uniqueOptions.map((optionValue, index) => {
                    const variant = getVariantForOption(optionValue);
                    const isSoldOut = variant?.inventory === 0;
                    
                    return (
                        <div key={index} className="flex flex-col items-center">
                            <Button
                                onClick={() => variant && !isSoldOut && handleVariantClick(variant)}
                                disabled={isSoldOut}
                                className={`px-4 py-2 rounded-xl border relative
                                    ${isSoldOut 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : selectedOption === optionValue
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-black hover:bg-gray-200'
                                    }`}
                            >
                                {optionValue}
                                {isSoldOut && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] mt-1 px-1 rounded-full">
                                        Sold Out
                                    </span>
                                )}
                            </Button>
                            {showPrices && variant && (
                                <div className="text-sm mt-1">
                                    <span className="font-semibold">₹{variant.price}</span>
                                    {variant.discount && (
                                        <span className="text-green-600 ml-1">
                                            ({variant.discount}% off)
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(OptionVariant); 