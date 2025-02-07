import VariantsComponent from "./VariantsComponent";

// Mock data for testing
const mockCampaignData = {
  collections: {
    variants: [
      {
        _id: "1",
        campaign_title: "Shilajit Gold Capsule - 60 Capsules Red",
        price: {
          offerPrice: { value: "1800.00", prefix: "₹" },
          originalPrice: { value: "2796.00", prefix: "₹" },
          discount: "35",
        },
        variant_id: "v1",
        product_handle: "shilajit-60-red",
        offer_id: "offer1",
        variant_options: {
          option1: "60 Capsules | 1 Month Course",
          option2: "red",
        },
      },
      {
        _id: "2",
        campaign_title: "Shilajit Gold Capsule - 120 Capsules Blue",
        price: {
          offerPrice: { value: "3200.00", prefix: "₹" },
          originalPrice: { value: "4596.00", prefix: "₹" },
          discount: "30",
        },
        variant_id: "v2",
        product_handle: "shilajit-120-blue",
        offer_id: "offer2",
        variant_options: {
          option1: "120 Capsules | 2 Month Course",
          option2: "blue",
        },
      },
      {
        _id: "3",
        campaign_title: "Shilajit Gold Capsule - 240 Capsules Green",
        price: {
          offerPrice: { value: "5400.00", prefix: "₹" },
          originalPrice: { value: "7996.00", prefix: "₹" },
          discount: "32",
        },
        variant_id: "v3",
        product_handle: "shilajit-240-green",
        offer_id: "offer3",
        variant_options: {
          option1: "240 Capsules | 4 Month Course",
          option2: "green",
        },
      },
    ],
  },
};

// Test component
const TestVariants = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Test Variants Component</h1>
      <VariantsComponent
        value={{
          variant: "option",
          collections: mockCampaignData.collections,
        }}
      />
    </div>
  );
};

export default TestVariants;
