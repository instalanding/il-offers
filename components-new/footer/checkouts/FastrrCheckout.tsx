import { Button } from "@/components/ui/button";
import useCheckout from "@/hooks/Checkout";

const FastrrCheckout = ({ campaign }: { campaign: any }) => {
  const { handleCheckout, handleMouseEnter, handleTouchStart } = useCheckout();

  return (
    <div>
      <input
        type="hidden"
        value={campaign.advertiser.store_url}
        id="sellerDomain"
      />
      <Button
        className={`max-w-[300px] border flex items-center justify-center text-[18px] gap-2 px-8 py-2 h-full flex-1 rounded-lg transition-colors
            ${false ? "opacity-50 cursor-not-allowed" : ""}`}
        style={{
          backgroundColor: campaign.config.primary_color,
          color: campaign.config.secondary_color,
        }}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onClick={(e) => {
          handleCheckout(
            e as React.MouseEvent<HTMLButtonElement, MouseEvent>,
            campaign.variant_id,
            campaign.offer_id,
            campaign.advertiser.coupon,
            "",
            1
          );
        }}
      >
        {false ? "Sold Out" : <>{campaign.config.button_text}</>}
      </Button>
    </div>
  );
};

export default FastrrCheckout;
