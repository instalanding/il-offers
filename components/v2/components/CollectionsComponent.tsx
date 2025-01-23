import React from 'react';
import VariantsCarousel from './Variants/VariantsCarousel';
import VariantSelector from './Variants/VariantsSelector';

interface CollectionsComponentProps {
    value: {
        variant: string;
        collections: {
            variant: Array<{
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
            }>;
        };
    };
    style?: React.CSSProperties;
}

const CollectionsComponent: React.FC<CollectionsComponentProps> = ({ value, style }) => {
    // Transform the variant data into the format expected by VariantsCarousel
    const variantData = value.collections?.variant?.map(item => ({
        label: item.campaign_title,
        price: parseFloat(item.price.offerPrice.value),
        originalPrice: parseFloat(item.price.originalPrice.value),
        discount: `${item.price.discount}% off`,
        variant_id: item.variant_id,
        product_handle: item.product_handle,
        offer_id: item.offer_id
    })) || [];

    const renderVariantComponent = () => {
        switch (value.variant) {
            case 'size':
                return <VariantSelector value="size" variants={variantData} />;
            case 'color':
                return <VariantSelector value="color" variants={variantData} />;
            case 'quantity':
                return <VariantSelector value="quantity" variants={variantData} />;
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

export default CollectionsComponent;