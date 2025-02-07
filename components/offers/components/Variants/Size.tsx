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
    size: string;
}

interface VariantSizeProps {
    selectedVariant: string | null;
    onVariantSelect: (variant: string) => void;
    variants?: VariantData[];
}

const Size: FC<VariantSizeProps> = ({ selectedVariant, onVariantSelect, variants = [] }) => {
    const router = useRouter();
    const handleVariantClick = (variant: VariantData) => {
        onVariantSelect(variant.size);
        if (variant.product_handle) {
            router.push(`/products/${variant.product_handle}?variant_id=${variant.variant_id}`);
        } else if (variant.offer_id) {
            router.push(`/${variant.offer_id}`);
        }
    };

    const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', '5XL'];

    const sortedVariants = [...variants].sort((a, b) => {
        return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
    });

    return (
        <div className="w-full">
            <div className="flex justify-center flex-wrap gap-2">
                {sortedVariants.map((variant, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <Button
                            onClick={() => handleVariantClick(variant)}
                            className={`px-4 py-2 rounded-xl border
                                ${selectedVariant === variant.size
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                            {variant.size}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(Size);