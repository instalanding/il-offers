"use client";

import React, { useState, FC } from 'react';
import VariantsCarousel from './VariantsCarousel';
import VariantSize from './VariantsSize';
import VariantsComponent from './VariantsComponent';

interface VariantSelectorProps {
    value: 'size' | 'color' | 'quantity';
    variants?: Array<{
        label: string;
        price: number;
        originalPrice: number;
        discount: string;
        variant_id?: string;
        product_handle?: string;
        offer_id?: string;
    }>;
}

const VariantSelector: FC<VariantSelectorProps> = ({ value, variants = [] }) => {
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

    const handleVariantClick = (variant: string) => {
        setSelectedVariant(variant);
    };

    if (value === "size") {
        return (
            <VariantSize selectedVariant={selectedVariant} onVariantSelect={handleVariantClick} />
        );
    }

    if (value === "color") {
        return (
            <div className="flex gap-3 justify-center">
                <div className="w-6 h-6 rounded-full bg-blue-500" onClick={() => handleVariantClick('blue')} />
                <div className="w-6 h-6 rounded-full bg-red-500" onClick={() => handleVariantClick('red')} />
                <div className="w-6 h-6 rounded-full bg-green-500" onClick={() => handleVariantClick('green')} />
                <div className="w-6 h-6 rounded-full bg-yellow-500" onClick={() => handleVariantClick('yellow')} />
                <div className="w-6 h-6 rounded-full bg-orange-500" onClick={() => handleVariantClick('orange')} />
            </div>
        );
    }

    if (value === "quantity") {
        return <VariantsCarousel variants={variants} />;
    }

    return <VariantsComponent variantType={selectedVariant} />;
};

export default VariantSelector;