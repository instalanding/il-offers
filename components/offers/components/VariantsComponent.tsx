import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import OptionVariant from './Variants/OptionVariant';

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
                variant_options: {
                    [key: string]: string;
                };
            }>;
        };
    };
    style?: React.CSSProperties;
}

const VariantsComponent: React.FC<VariantsComponentProps> = ({ value, style }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const currentVariantId = searchParams.get('variant_id');

    const handleOptionClick = useCallback((option: string) => {
        setSelectedOption(option);
    }, []);

    useEffect(() => {
        if (currentVariantId && value.collections?.variants) {
            const currentVariant = value.collections.variants.find(v => v.variant_id === currentVariantId);
            if (currentVariant?.variant_options?.option1) {
                setSelectedOption(currentVariant.variant_options.option1);
            }
        }
    }, [currentVariantId, value.collections?.variants]);

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
        options: item.variant_options || {}
    }));

    const sortedVariantData = [...variantData].sort((a, b) => a.price - b.price);

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
                    selectedOption={selectedOption}
                    onOptionSelect={handleOptionClick}
                    variants={sortedVariantData}
                    showPrices={false}
                />
            ))}
        </div>
    );
};

export default React.memo(VariantsComponent);