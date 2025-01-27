import React, { FC } from 'react';
import { useRouter } from 'next/navigation';

interface VariantData {
    label: string;
    price: number;
    originalPrice: number;
    discount: string;
    variant_id?: string;
    product_handle?: string;
    offer_id?: string;
}

interface VariantSizeProps {
    selectedVariant: string | null;
    onVariantSelect: (variant: string) => void;
    variants?: VariantData[];
}

const Size: FC<VariantSizeProps> = ({ selectedVariant, onVariantSelect, variants = [] }) => {
    const router = useRouter();

    const handleVariantClick = (variant: VariantData) => {
        onVariantSelect(variant.label);
        if (variant.offer_id) {
            router.push(`/${variant.offer_id}`);
        } else if (variant.product_handle) {
            router.push(`/products/${variant.product_handle}?variant_id=${variant.variant_id}`);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-center flex-wrap gap-2">
                {variants.map((variant, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <button
                            onClick={() => handleVariantClick(variant)}
                            className={`px-4 py-2 rounded-xl border transition-colors 
                                ${selectedVariant === variant.label
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-50'}`}
                        >
                            {variant.label}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Size;