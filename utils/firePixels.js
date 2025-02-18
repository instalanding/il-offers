import React from 'react';

export const firePixels = (pixelIds, campaign, checkoutData, price) => {
  if (!pixelIds || pixelIds.length === 0) return null;

  return pixelIds.map((pixelId) => (
    <React.Fragment key={pixelId}>
      {/* Facebook PageView Pixel */}
      <img
        height={1}
        width={1}
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        alt='Facebook Pixel'
      />

      {/* Facebook ViewContent Pixel */}
      {checkoutData.variant_id && (
        <img
          height='1'
          width='1'
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=ViewContent&noscript=1&cd[content_name]=${
            campaign.campaign_title || 'Offer'
          }
                        &cd[content_category]=Offer
                        &cd[content_ids]=${checkoutData.variant_id || 'none'}
                        &cd[content_type]=${campaign.product_handle || 'none'}
                        &cd[value]=${price.offerPrice.value || 0}
                        &cd[currency]=INR`}
          alt='Facebook Pixel ViewContent'
        />
      )}
    </React.Fragment>
  ));
};
