import ShopifyCheckout from "./checkouts/ShopifyCheckout";
import FastrrCheckout from "./checkouts/FastrrCheckout";

const Checkout = ({ campaign }: { campaign: any }) => {
  const checkout = campaign.advertiser.checkout_type;

  return (
    <>
      {checkout === "shiprocket" ||
      checkout === "fastr" ||
      checkout === "fastrr" ? (
        <FastrrCheckout campaign={campaign} />
      ) : (
        <ShopifyCheckout campaign={campaign} />
      )}
    </>
  );
};

export default Checkout;
