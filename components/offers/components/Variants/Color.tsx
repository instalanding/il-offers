import React, { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
interface VariantData {
    label: string;
    price: number;
    originalPrice: number;
    discount: string;
    variant_id?: string;
    product_handle?: string;
    offer_id?: string;
    color: string;
}

interface ColorVariantProps {
    selectedVariant: string | null;
    onVariantSelect: (variant: string) => void;
    variants?: VariantData[];
}

const Color: FC<ColorVariantProps> = ({ selectedVariant, onVariantSelect, variants = [] }) => {
    const router = useRouter();

    const handleVariantClick = (variant: VariantData) => {
        onVariantSelect(variant.color);
        if (variant.product_handle) {
            router.push(`/products/${variant.product_handle}?variant_id=${variant.variant_id}`);
        } else if (variant.offer_id) {
            router.push(`/${variant.offer_id}`);
        }
    };

    const getColorClass = (color: string) => {
        const colorMap: { [key: string]: string } = {
            blue: 'bg-blue-500',
            red: 'bg-red-500',
            green: 'bg-green-500',
            yellow: 'bg-yellow-500',
            orange: 'bg-orange-500',
            purple: 'bg-purple-500',
            pink: 'bg-pink-500',
            black: 'bg-black',
            white: 'bg-white border-2',
            gray: 'bg-gray-500',
        };
        return colorMap[color.toLowerCase()] || 'bg-gray-500';
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-4 justify-center">
                {variants.map((variant, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <Button
                            onClick={() => handleVariantClick(variant)}
                            className={`w-10 h-10 rounded-full ${getColorClass(variant.color || 'gray')} 
                                transition-transform hover:scale-110 ${selectedVariant === variant.color ? 'ring-2 ring-offset-2 ring-blue-500' : 'bg-white border-2 ring-0'}`}
                            title={variant.color}
                        />
                        <Label className="mt-2 font-semibold text-gray-500 text-xs">{variant.color}</Label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(Color);