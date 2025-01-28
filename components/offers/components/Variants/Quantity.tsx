import React from "react";
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

interface VariantsCarouselProps {
    variants: VariantData[];
}

const Quantity: React.FC<VariantsCarouselProps> = ({ variants }) => {
    const router = useRouter();

    const handleVariantClick = (variant: VariantData) => {
        if (variant.product_handle) {
            router.push(`/products/${variant.product_handle}?variant_id=${variant.variant_id}`);
        } else if (variant.offer_id) {
            router.push(`/${variant.offer_id}`);
        }
    };

    return (
        <div className="w-full bg-white">
            <div className="flex flex-wrap gap-4">
                {variants.map((variant, index) => (
                    <div
                        key={index}
                        onClick={() => handleVariantClick(variant)}
                        className="snap-start flex-shrink-0 w-[174px] border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <p className="text-sm font-medium line-clamp-2">{variant.label}</p>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-xl font-semibold text-gray-800">
                                ₹{variant.price}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                                ₹{variant.originalPrice}
                            </span>
                        </div>
                        <p className="text-red-600 text-sm font-medium mt-1">
                            {variant.discount}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Quantity;