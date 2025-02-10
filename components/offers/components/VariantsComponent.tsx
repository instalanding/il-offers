import React, { useState, useCallback, useEffect } from 'react';
import OptionVariant from './Variants/OptionVariant';
import { useSearchParams } from 'next/navigation';

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
                offer_id: string;
                variant_options: {
                    [key: string]: string;
                };
                inventory?: number;
            }>;
        };
    };
    style?: React.CSSProperties;
}

const VariantsComponent: React.FC<VariantsComponentProps> = ({ value, style }) => {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const searchParams = useSearchParams();
    const currentVariantId = searchParams.get('variant_id');


    const handleOptionClick = useCallback((option: string, optionKey: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionKey]: option
        }));
    }, []);

    useEffect(() => {
        if (value.collections?.variants) {
            let targetVariant
            if (currentVariantId) {
                targetVariant = value.collections.variants.find(v => v.variant_id === currentVariantId);
            } else {
                targetVariant = value.collections.variants[0];
            }

            if (targetVariant?.variant_options) {
                // Initialize all available options from the variant
                const initialOptions: Record<string, string> = {};
                Object.entries(targetVariant.variant_options).forEach(([key, value]) => {
                    if (value) {
                        initialOptions[key] = value;
                    }
                });
                setSelectedOptions(initialOptions);
            }
        }
    }, [value.collections?.variants, currentVariantId]);

    // Return null if no variants or variant_options
    if (!value.collections?.variants?.length ||
        !value.collections.variants.some(v => v.variant_options && Object.keys(v.variant_options).length > 0)) {
        return null;
    }

    const variantData = value.collections.variants.map(item => ({
        label: item.campaign_title,
        price: parseFloat(item.price.offerPrice.value),
        originalPrice: parseFloat(item.price.originalPrice.value),
        discount: item.price.discount,
        variant_id: item.variant_id,
        product_handle: item.product_handle,
        offer_id: item.offer_id,
        inventory: item.inventory,
        options: item.variant_options || {}
    }));

    const sortedVariantData = variantData.sort((a, b) => a.price - b.price);

    const optionKeys = sortedVariantData[0]?.options
        ? Object.keys(sortedVariantData[0].options).filter(key => key !== 'title')
        : [];

    if (optionKeys.length === 0) {
        return null;
    }

    return (
        <div style={style} className="flex flex-col p-4">
            {optionKeys.map(optionKey => (
                <OptionVariant
                    key={optionKey}
                    optionKey={optionKey}
                    selectedOption={selectedOptions[optionKey] || null}
                    onOptionSelect={(option) => handleOptionClick(option, optionKey)}
                    variants={sortedVariantData}
                    showPrices={false}
                />
            ))}
        </div>
    );
};

export default React.memo(VariantsComponent);