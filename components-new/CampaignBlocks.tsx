

import React, { memo } from "react";
import dynamic from "next/dynamic";
import TextComponent from './blocks/TextComponent';

// const ReviewsComponent = dynamic(() => import("./blocks/ReviewsComponent"), { ssr: false , loading: () => <p>Loading reviews...</p> });
// const HtmlComponent = dynamic(() => import('./blocks/HtmlComponent'),{ ssr: false , loading: () => <p>Loading Html...</p> });

import ReviewsComponent from "./blocks/ReviewsComponent";
import HtmlComponent from "./blocks/HtmlComponent";

interface CampaignBlocksProps {
  blocks: any[];
  campaign: any;
}
const blockComponents: Record<string, React.ComponentType<any>> = {
  reviews: ReviewsComponent,
  text: TextComponent,
  html:HtmlComponent
};
const CampaignBlocks: React.FC<CampaignBlocksProps> = memo(({ blocks, campaign }) => {
  return (
    <div>
        {blocks.map((block) => {
        const Component = blockComponents[block.type]; 
        if (!Component) return <></>; 
        return (
          <Component
            key={block.id}
            value={block.type !== "reviews" ? block.value : { ...block.value, reviews: campaign.reviews }}
            style={block.style}
          />
        );
      })}
    </div>
  );
});

export default CampaignBlocks;