import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react'

const ShopifyCheckout = ({ campaign }: { campaign: any }) => {
  const router = useRouter();
    
  return (
    <div>
      <Button
        className={`max-w-[300px] border flex items-center justify-center text-[18px] gap-2 px-8 py-2 h-full flex-1 rounded-lg transition-colors
            ${false ? "opacity-50 cursor-not-allowed" : ""}`}
        style={{
          backgroundColor: campaign.config.primary_color,
          color: campaign.config.secondary_color,
        }}
        onClick={(e) => {
          router.push(
            `https://${campaign.advertiser.store_url}/cart/${campaign.variant_id}:${1}`
        );
        }}
      >
        {false ? "Sold Out" : <>{campaign.config.button_text}</>}
      </Button>
    </div>
  )
}

export default ShopifyCheckout