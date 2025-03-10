'use client';

import { useSearchParams } from 'next/navigation';
import Campaigns from "@/components/offers/Campaigns";

export function CampaignWithParams({ campaignData, userIp }: { campaignData: any, userIp: string }) {
  const searchParams = useSearchParams();
  
  // Extract the variant from search params
  const variant = searchParams.get('variant');
  
  // Filter campaign based on variant
  const filteredCampaign = variant 
    ? campaignData.filter((campaign: any) => campaign.variant_id === variant)
    : campaignData;
  
  // Extract UTM params
  const utm_params = Object.fromEntries(
    Array.from(searchParams.entries()).filter(([key]) =>
      key.startsWith('utm_') || 
      ['source', 'medium', 'campaign', 'id', 'term', 'content'].includes(key)
    )
  );
  
  console.log("_________searchParams_________", Object.fromEntries(searchParams.entries()));
  
  return (
    <Campaigns 
      campaignData={{
        ...(filteredCampaign.length > 0 ? filteredCampaign[0] : {}), 
        collections: campaignData, 
        reviews:[]
      }} 
      userIp={userIp} 
      utm_params={utm_params} 
    />
  );
} 