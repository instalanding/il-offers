import React, { useState, useCallback } from 'react';
import Size from './Variants/Size';
import Quantity from './Variants/Quantity';
import Color from './Variants/Color';

interface VariantsComponentProps {
    value: {
        variant: string;
        collections: {
            variants: Array<{
                _id: string;
                campaign_title: string;
                price: {
                    offerPrice: { value: string; prefix: string };
                    originalPrice: { value: string; prefix: string };
                    discount: string;
                };
                variant_id?: string;
                product_handle?: string;
                offer_id?: string;
                size: string;
                color: string;
            }>;
        };
    };
    style?: React.CSSProperties;
}

const VariantsComponent: React.FC<VariantsComponentProps> = ({ value, style }) => {
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

    const variantData = value.collections?.variants?.map(item => ({
        label: item.campaign_title,
        price: parseFloat(item.price.offerPrice.value),
        originalPrice: parseFloat(item.price.originalPrice.value),
        discount: item.price.discount,
        variant_id: item.variant_id,
        product_handle: item.product_handle,
        offer_id: item.offer_id,
        size: item.size,
        color: item.color,
    })) || [];

    const handleVariantClick = useCallback((variant: string) => {
        setSelectedVariant(variant);
    }, []);

    const renderVariantComponent = () => {
        switch (value.variant) {
            case 'size':
                return (
                    <Size
                        selectedVariant={selectedVariant}
                        onVariantSelect={handleVariantClick}
                        variants={variantData}
                    />
                );
            case 'color':
                return (
                    <Color
                        selectedVariant={selectedVariant}
                        onVariantSelect={handleVariantClick}
                        variants={variantData}
                    />
                );
            case 'quantity':
                return <Quantity variants={variantData} />;
            default:
                return null;
        }
    };

    return (
        <div style={style} className="flex flex-col p-4">
            {renderVariantComponent()}
        </div>
    );
};

export default React.memo(VariantsComponent);