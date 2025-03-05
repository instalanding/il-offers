"use client";
import React, { useState, useEffect, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import Footer from './components/Footer';
import TextComponent from './components/TextComponent';
import createGradient from "../../lib/createGradient";
import { firePixels } from "../../utils/firePixels";

// Dynamically import heavy components
const CarouselComponent = dynamic(() => import('./components/CarouselComponent'), { 
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded"></div> 
});
const AccordionComponent = dynamic(() => import('./components/AccordionComponent'));
const HtmlComponent = dynamic(() => import('./components/HtmlComponent'));
const RatingsComponent = dynamic(() => import('./components/RatingsComponent'));
const MultipleCta = dynamic(() => import('./components/MultipleCta'));
const VariantsComponent = dynamic(() => import('./components/VariantsComponent'));
const ReviewsComponent = dynamic(() => import('./components/ReviewsComponent'));
const Checkout = dynamic(() => import('./components/Checkout'));
const Ticker = dynamic(() => import('./components/Ticker'));
const Tags = dynamic(() => import('./components/Tags'));
const RecordImpressions = dynamic(() => import('../recordImpressions/page'), { ssr: false });

interface CampaignData {
    _id: string,
    campaign_title: string,
    product_handle: string,
    offer_id: string,
    variant_id: string,
    coupon_code: string;
    color?: string;
    size?: string;
    blocks: string;
    config: {
        font_family: string;
        primary_color: string;
        secondary_color: string;
        header_text: string;
        footer_text: string;
        button_text: string;
        cloudinary_params: string;
    };
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
    reviews: [];
    collections: {
        variants: Array<{
            variant_id: string;
            variant_options: {
                title?: string;
                option1?: string;
                option2?: string;
                option3?: string;
                [key: string]: string | undefined;
            };
            price: {
                offerPrice?: { value: string; prefix: string };
                originalPrice?: { value: string; prefix: string };
            };
            product_handle?: string;
            inventory: number;
        }>;
    };
    inventory?: number,
    advertiser: {
        _id: string;
        store_url: string;
        coupon: string;
        store_logo: {
            url: string;
        };
        checkout: {
            checkout_name: string;
        }
        pixel: {
            id: "";
            ids: [""];
        }
    }
}

interface V2Props {
    campaignData: CampaignData;
    userIp: string;
    utm_params: Record<string, string>;
    preserveParams?: boolean;
}

interface Block {
    id: string;
    type: string;
    htmlTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
    images?: { url: string }[];
    value?: any;
    style?: React.CSSProperties;
    price?: number;
    discount?: number;
    variantType?: string;
}

const Campaigns: React.FC<V2Props> = ({ campaignData, userIp, utm_params, preserveParams = false }) => {
    // console.log('campaignData', campaignData);

    const [campaign, setCampaign] = useState<CampaignData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };
    // Function to find and set the correct campaign variant
    const updateCampaignVariant = (variants: any[], variantId: string | null) => {
        if (!variantId) {
            setCampaign(campaignData);
            return;
        }

        const newVariant = variants.find(v => v.variant_id === variantId);
        if (newVariant) {
            setCampaign(prev => ({
                ...prev!,
                variant_id: newVariant.variant_id,
                price: newVariant.price,
                variant_options: newVariant.variant_options,
                blocks: newVariant.blocks,
                config: newVariant.config
            }));
        }
    };

    const updateUrlWithParams = (variantId: string | null) => {
        if (!preserveParams) return;

        const currentUrl = new URL(window.location.href);
        const params = new URLSearchParams(currentUrl.search);

        // Update variant
        if (variantId) {
            params.set('variant', variantId);
        }

        // Ensure UTM parameters are present
        Object.entries(utm_params).forEach(([key, value]) => {
            if (value && !params.has(key)) {
                params.set(key, value);
            }
        });

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    };

    // Initial campaign setup
    useEffect(() => {
        setCampaign(campaignData);
    }, [campaignData]);

    // Listen for variant changes
    useEffect(() => {
        const handleVariantChange = (event: CustomEvent) => {
            const variantId = event.detail.variantId;
            if (campaignData.collections?.variants) {
                updateUrlWithParams(variantId);
                updateCampaignVariant(campaignData.collections.variants, variantId);
            }
        };

        window.addEventListener('variantChanged', handleVariantChange as EventListener);
        return () => {
            window.removeEventListener('variantChanged', handleVariantChange as EventListener);
        };
    }, [campaignData, utm_params]);

    // Initial URL handling
    useEffect(() => {
        const currentUrl = new URL(window.location.href);
        const params = new URLSearchParams(currentUrl.search);
        const variantId = params.get('variant');

        if (preserveParams) {
            updateUrlWithParams(variantId);
        }

        if (campaignData.collections?.variants) {
            updateCampaignVariant(campaignData.collections.variants, variantId);
        }
    }, [campaignData, utm_params]);

    if (error) return <div>Error: {error}</div>;
    if (!campaign) return <></>;

    const blocks: Block[] = JSON.parse(campaign.blocks);

    const campaignConfig = {
        font_family: campaign.config.font_family,
        primaryColor: campaign.config.primary_color,
        secondaryColor: campaign.config.secondary_color,
        headerText: campaign.config.header_text,
        footerText: campaign.config.footer_text,
        buttonText: campaign.config.button_text,
    };

    const price = {
        offerPrice: {
            prefix: campaign.price.offerPrice.prefix,
            value: campaign.price.offerPrice.value,
        },
        originalPrice: {
            prefix: campaign.price.originalPrice.prefix,
            value: campaign.price.originalPrice.value,
        },
        quantity: campaign.price.quantity
    }

    const checkoutData = {
        campaign_id: campaign._id,
        variant_id: campaign.variant_id,
        offer_id: campaign.offer_id,
        store_url: campaign.advertiser?.store_url,
        checkout_name: campaign.advertiser?.checkout?.checkout_name,
        userIp: userIp,
        utm_params: utm_params,
        pixel: (campaign.advertiser.pixel?.ids[0] || campaign.advertiser.pixel?.id) ?? [""],
        advertiser_id: campaign.advertiser?._id,
        coupon_code: campaign.advertiser?.coupon ?? "",
        inventory: campaign.inventory,
        tags: []
    };

    const hasMultipleCta = blocks.some(block => block.type === 'multiple-cta');

    const getCurrentVariantInventory = () => {
        if (campaign?.collections?.variants) {
            const currentVariant = campaign.collections.variants.find(
                v => v.variant_id === campaign.variant_id
            );
            return currentVariant?.inventory;
        }
        return campaign?.inventory;
    };



    return (
        <>
            {campaign.advertiser.pixel && campaign.advertiser.pixel.ids &&
                firePixels(campaign.advertiser.pixel.ids, campaign, checkoutData, price)}

            <RecordImpressions
                checkoutData={checkoutData}
            />
            <main
                className="w-full overflow-auto h-[100dvh] p-[2%] max-sm:p-0 "
                style={{
                    overflowY: 'auto', backgroundImage: campaign?.config?.primary_color
                        ? createGradient(campaign.config.primary_color)
                        : 'none'
                }}
            >
                <div style={{ fontFamily: campaignConfig.font_family }} className="w-[400px] bg-white flex flex-col max-sm:w-full h-full shadow-lg max-sm:shadow-none md:rounded-lg overflow-auto mx-auto rounded-none">

                    <Header config={campaignConfig} logo={campaign.advertiser.store_logo?.url} offerId={campaign.offer_id} storeUrl={checkoutData.store_url} utm_params={utm_params} />
                    {blocks.map((block: Block) => {
                        switch (block.type) {
                            case 'carousel':
                                return <CarouselComponent prefix={campaign.config.cloudinary_params} key={block.id} images={block.images || []} />;
                            case 'text':
                                return (
                                    <TextComponent
                                        key={block.id}
                                        value={block.value || ''}
                                        style={block.style}
                                        htmlTag={block.htmlTag || 'p'}
                                    />
                                );
                            case 'html':
                                return (
                                    <HtmlComponent
                                        key={block.id}
                                        value={block.value || ''}
                                        style={block.style}
                                    />
                                );
                            case 'ratings':
                                return (
                                    <RatingsComponent
                                        key={block.id}
                                        value={block.value || ''}
                                        style={block.style}
                                    />
                                );
                            case 'reviews':
                                return campaignData.reviews && campaignData.reviews.length > 0 ? (
                                    <ReviewsComponent
                                        key={block.id}
                                        value={{ ...block.value, reviews: campaignData.reviews }}
                                        style={block.style}
                                    />
                                ) : null;
                            case 'accordion':
                                return (
                                    <AccordionComponent
                                        key={block.id}
                                        value={Array.isArray(block.value) ? block.value : []}
                                        style={block.style}
                                    />
                                );
                            case 'variants':
                                return (
                                    <VariantsComponent
                                        key={block.id}
                                        value={{
                                            options: block.value?.options || {
                                                option1: { enabled: true, label: 'Select an option', displayStyle: 'capsule' },
                                                option2: { enabled: true, label: 'Choose a variant', displayStyle: 'capsule' },
                                                option3: { enabled: true, label: 'Pick one', displayStyle: 'capsule' }
                                            }
                                        }}
                                        style={block.style}
                                        collections={campaignData.collections}
                                    />
                                );
                            case 'multiple-cta':
                                return (
                                    <MultipleCta
                                        key={block.id}
                                        value={block.value}
                                        checkoutData={checkoutData}
                                        style={block.style}
                                    />
                                );
                            case 'checkout':
                                return (
                                    <Checkout
                                        key={block.id}
                                        value={block.value}
                                        style={block.style}
                                        checkoutData={{
                                            ...checkoutData,
                                            variant_id: campaign.variant_id,
                                            inventory: getCurrentVariantInventory()
                                        }}
                                        quantity={quantity}
                                        handleIncrease={handleIncrease}
                                        handleDecrease={handleDecrease}
                                    />
                                );
                            case 'ticker':
                                return (
                                    <Ticker
                                        key={block.id}
                                        value={block.value}
                                        style={block.style} />
                                );
                            case 'tags':
                                return (
                                    <Tags
                                        key={block.id}
                                        value={block.value}
                                        style={block.style} />
                                );
                            default:
                                return null;
                        }
                    })}
                    {!hasMultipleCta && <Footer
                        config={campaignConfig}
                        price={price}
                        quantity={quantity}
                        handleIncrease={handleIncrease}
                        handleDecrease={handleDecrease}
                        checkoutData={{
                            ...checkoutData,
                            variant_id: campaign.variant_id,
                            inventory: getCurrentVariantInventory()
                        }}
                    />}
                </div>
            </main>
        </>
    );
};

export default Campaigns;