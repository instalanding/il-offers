import React, { FC } from 'react';

interface VariantSizeProps {
    selectedVariant: string | null;
    onVariantSelect: (variant: string) => void;
}

const VariantSize: FC<VariantSizeProps> = ({ selectedVariant, onVariantSelect }) => {
    const variants = ["XS", "S", "M", "L", "XL", "XXL"];

    return (
        <div className="flex flex-wrap gap-2">
            {variants.map((variant, index) => (
                <button
                    key={index}
                    onClick={() => onVariantSelect(variant)}
                    className={`px-4 py-2 rounded-xl border transition-colors ${selectedVariant === variant ? 'bg-blue-500 text-white' : ''}`}
                >
                    {variant}
                </button>
            ))}
        </div>
    );
};

export default VariantSize;