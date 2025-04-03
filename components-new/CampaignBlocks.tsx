

import React, { memo } from "react";
import dynamic from "next/dynamic";

const ReviewsComponent = dynamic(() => import("./blocks/ReviewsComponent"), { ssr: false });

interface CampaignBlocksProps {
  blocks: any[];
  campaign: any;
}

const CampaignBlocks: React.FC<CampaignBlocksProps> = memo(({ blocks, campaign }) => {
  return (
    <div className="space-y-4 p-4">
      {blocks.map((block) =>
        block.type === "reviews" ? (
          <ReviewsComponent
            key={block.id}
            value={{ ...block.value, reviews: campaign.reviews }}
            style={block.style}
          />
        ) : <></>
      )}
    </div>
  );
});

export default CampaignBlocks;