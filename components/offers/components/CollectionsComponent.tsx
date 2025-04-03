import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation'; // Add usePathname


interface CampaignData {
    _id: string,
    campaign_title: string,
    product_handle: string,
    offer_id: string,
    variant_id: string,
    price: {
        offerPrice: {
            prefix: string;
            value: string;
        },
        originalPrice: {
            prefix: string;
            value: string;
        },
        quantity: boolean
    };
    inventory?: number,
    meta_description: {
        image: {
            public_id: string;
            url: string;
        }
    }
}

interface CollectionsComponentProps {
    value: {
        label?: string;
        collection_id?: string;
    };
    style?: React.CSSProperties;
    collectionById?: {
        campaigns: CampaignData[];
    };
}


const CollectionsComponent: React.FC<CollectionsComponentProps> = ({ value, style, collectionById }) => {
    const router = useRouter();
    const pathname = usePathname();
    const currentProductHandle = pathname.split('/products/')[1];

    if (!collectionById?.campaigns?.length) {
        return null;
    }

    const handleProductClick = (variant: CampaignData) => {
        if (variant.product_handle) {
            // Open in new tab using window.open
            window.location.href = `/products/${variant.product_handle}?variant=${variant.variant_id}`;
            // window.open(`/products/${variant.product_handle}?variant=${variant.variant_id}`);
        }
    };

    return (
        <div style={style} className="w-full">
            <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 flex items-center justify-start gap-1">
                    <span className='font-bold'>{value.label || 'Our Collection'}</span>
                </h3>
            </div>

            <div className="flex flex-wrap justify-start items-center gap-3">
                {collectionById.campaigns.map((variant) => {
                    const isSelected = variant.product_handle === currentProductHandle;

                    return (
                        <div
                            key={variant.variant_id}
                            className={`
                                relative rounded-lg cursor-pointer transition-all duration-300
                                ${isSelected
                                    ? 'ring-2 ring-offset-2 ring-black scale-[1.02] shadow-lg'
                                    : 'shadow-lg hover:shadow-xl hover:scale-[1.02]'
                                }
                            `}
                            onClick={() => handleProductClick(variant)}
                        >
                            <div className="relative h-14 w-14 overflow-hidden rounded-lg">
                                <Image
                                    src={variant.meta_description.image.url}
                                    alt={variant.campaign_title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CollectionsComponent;