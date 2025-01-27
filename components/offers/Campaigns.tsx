"use client";
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CarouselComponent from './components/CarouselComponent';
import AccordionComponent from './components/AccordionComponent';
import HtmlComponent from './components/HtmlComponent';
import TextComponent from './components/TextComponent';
import RatingsComponent from './components/RatingsComponent';
import MultipleCta from './components/MultipleCta';
import VariantsComponent from './components/VariantsComponent'
import ReviewsComponent from './components/ReviewsComponent';
import RecordImpressions from '../recordImpressions/page';

interface CampaignData {
    _id: string,
    offer_id: string,
    variant_id: string,
    coupon_code: string;
    blocks: string;
    config: {
        font_family: string;
        primary_color: string;
        secondary_color: string;
        header_text: string;
        footer_text: string;
        button_text: string;
    };
    price: {
        offerPrice: {
            prefix: string;
            value: string;
        },
        originalPrice: {
            prefix: string;
            value: string;
        }
    };
    reviews: [];
    collections: [];
    advertiser: {
        _id: string;
        store_url: string;
        store_logo: {
            url: string;
        };
        checkout: {
            checkout_name: string;
        }
        pixel: {
            id: string;
        }
    }
}

interface V2Props {
    campaignData: CampaignData;
    userIp: string;
    utm_params: Object;
}

interface Block {
    id: string;
    type: string;
    images?: { url: string }[];
    value?: any;
    style?: React.CSSProperties;
    price?: number;
    discount?: number;
    variantType?: string;
}

const Campaigns: React.FC<V2Props> = ({ campaignData, userIp, utm_params }) => {
    // console.log('campaignData', campaignData);

    const [campaign, setCampaign] = useState<CampaignData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCampaign(campaignData);
    }, [campaignData]);

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
        }
    }

    const checkoutData = {
        campaign_id: campaign._id,
        variant_id: campaign.variant_id,
        offer_id: campaign.offer_id,
        store_url: campaign.advertiser?.store_url,
        checkout_name: campaign.advertiser?.checkout?.checkout_name,
        userIp: userIp,
        utm_params: utm_params,
        pixel_id: campaign.advertiser.pixel?.id ?? "",
        advertiser_id: campaign.advertiser?._id,
        coupon_code: campaign.coupon_code ?? "",
        tags: [],
    };

    const hasMultipleCta = blocks.some(block => block.type === 'multiple-cta');

    return (
        <>
            <RecordImpressions
                checkoutData={checkoutData}
                userIp={userIp}
                utm_params={utm_params}
            />
            <main
                className="w-full overflow-auto h-[100dvh] p-[2%] max-sm:p-0"
                style={{ overflowY: 'auto' }}
            >
                <div style={{ fontFamily: campaignConfig.font_family }} className="w-[400px] bg-white flex flex-col max-sm:w-full h-full shadow-lg max-sm:shadow-none max-sm:rounded-none overflow-auto mx-auto rounded-lg">
                    <Header config={campaignConfig} logo={campaign.advertiser.store_logo?.url} />
                    {blocks.map((block: Block) => {
                        switch (block.type) {
                            case 'carousel':
                                return <CarouselComponent key={block.id} images={block.images || []} />;
                            case 'text':
                                return (
                                    <TextComponent
                                        key={block.id}
                                        value={block.value || ''}
                                        style={block.style}
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
                                        value={{ ...block.value, variant: block.variantType as 'size' | 'color' | 'quantity' || 'quantity', collections: campaignData.collections }}
                                        style={block.style}
                                    />
                                );
                            case 'multiple-cta':
                                return (
                                    <MultipleCta
                                        key={block.id}
                                        value={block.value}
                                        checkoutData={checkoutData}
                                    />
                                );
                            default:
                                return null;
                        }
                    })}
                    {!hasMultipleCta && <Footer config={campaignConfig} price={price} checkoutData={checkoutData} />}
                </div>
            </main>
        </>
    );
};

export default Campaigns;