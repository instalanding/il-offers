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
import VariantSelector from './components/Variants/VariantsSelector';

interface CampaignData {
    blocks: string;
    config: {
        font_family: string;
        primary_color: string;
        secondary_color: string;
        header_text: string;
        footer_text: string;
        button_text: string;
    };
}

interface V2Props {
    campaignData: CampaignData;
    // collection: Collection;
}

// interface Collection {

// }
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

const V2: React.FC<V2Props> = ({ campaignData }) => {
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

    const hasMultipleCta = blocks.some(block => block.type === 'multiple-cta');

    return (
        <main
            className="w-full overflow-auto h-[100dvh] p-[2%] max-sm:p-0"
            style={{ overflowY: 'auto' }}
        >
            <div style={{ fontFamily: campaignConfig.font_family }} className="w-[400px] bg-white flex flex-col max-sm:w-full h-full shadow-lg max-sm:shadow-none max-sm:rounded-none overflow-auto mx-auto rounded-lg">
                <Header config={campaignConfig} />
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
                                <VariantSelector
                                    key={block.id}
                                    value={block.variantType as 'size' | 'color' | 'quantity' || 'size'}
                                // collection={collection}
                                />
                            );
                        case 'multiple-cta':
                            return (
                                <MultipleCta
                                    key={block.id}
                                    value={block.value}
                                />
                            );
                        default:
                            return null;
                    }
                })}
                {!hasMultipleCta && <Footer config={campaignConfig} />}
            </div>
        </main>
    );
};

export default V2;