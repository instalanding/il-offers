import React from "react";
import Link from "next/link";

interface Price {
  prefix: string;
  value: string;
}

interface Product {
  _id: string;
  variant_id: string;
  variant_type?: string;
  campaign_name?: string;
  price: {
    offerPrice?: Price;
    originalPrice?: Price;
  };
}

interface CurrentSchema {
  all_campaigns: Product[];
  product_handle: string;
  campaign_name?: string;
  config?: {
    backgroundColor?: string;
  };
}

interface VariantsSectionProps {
  currentSchema: CurrentSchema;
  currentVariantId: string | null;
  setCurrentVariantId: (id: string) => void;
  offer_id: string;
  offer_ids: string[];
}

const VariantsSection: React.FC<VariantsSectionProps> = ({
  currentSchema,
  currentVariantId,
  setCurrentVariantId,
  offer_id,
  offer_ids,
}) => {
  const calculatePercentageOff = (originalPrice: number, offerPrice: number) => {
    return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
  };

  const renderPrice = (product: Product) => {
    const { offerPrice, originalPrice } = product.price || {};
    const isCurrentVariant = product.variant_id === currentVariantId;

    return (
      <div className="flex items-center justify-center">
        {offerPrice?.value ? (
          <div className="flex flex-col gap-1">
            {originalPrice?.value && parseFloat(offerPrice.value) < parseFloat(originalPrice.value) ? (
              <div className="flex flex-wrap justify-center items-center">
                <p className="text-[12px] text-gray-600 line-through pr-1">
                  {originalPrice.prefix}{originalPrice.value}
                </p>
                <p style={{ color: currentSchema.config?.backgroundColor }} className="text-[15px] font-semibold pr-1">
                  {offerPrice.prefix}{offerPrice.value}
                </p>
                <p className="text-[13px] text-red-600">
                  {calculatePercentageOff(parseFloat(originalPrice.value), parseFloat(offerPrice.value))}% off
                </p>
              </div>
            ) : (
              <p style={{ color: currentSchema.config?.backgroundColor }} className="text-[18px] font-semibold text-green-600">
                {offerPrice.prefix}{offerPrice.value}
              </p>
            )}
          </div>
        ) : originalPrice?.value ? (
          <p className="text-[15px] font-semibold text-green-600">
            {originalPrice.prefix}{originalPrice.value}
          </p>
        ) : (
          <p className="text-[15px] text-center text-gray-600">Price not available</p>
        )}
      </div>
    );
  };

  return (
    currentSchema.all_campaigns && currentSchema.all_campaigns.length > 1 && (
      <section className={`px-4 my-3 ${offer_ids.includes(offer_id) ? "bg-[#122442]" : "bg-white"} rounded-lg`}>
        <h1 className="flex flex-col text-[17px] mb-2 font-semibold">Available Options</h1>
        {currentVariantId && (
          <div className="text-xs mb-2 space-y-[7px]">
            {currentSchema.all_campaigns.find(p => p.variant_id === currentVariantId)?.variant_type?.split(/[\|-]/).map((part, index) => (
              <p key={index}>{part}</p>
            )) || currentSchema.campaign_name}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {currentSchema.all_campaigns.map(product => (
            <div
              key={product._id}
              className={`flex-shrink-0 flex justify-center items-center cursor-pointer border rounded-lg p-2 hover:shadow-[0_2px_15px_rgba(0,0,0,0.2)] ${product.variant_id === currentVariantId ? "border border-[#0000005a] shadow-[0_1px_10px_rgba(0,0,0,0.1)]" : ""} ${offer_ids.includes(offer_id) && "bg-white"}`}
              onClick={() => setCurrentVariantId(product.variant_id)}
            >
              <Link href={`/products/${currentSchema.product_handle}?variant=${product.variant_id}`}>
                <h2 className="text-[13px] line-clamp-2 text-center">{product.variant_type || product.campaign_name}</h2>
                {renderPrice(product)}
              </Link>
            </div>
          ))}
        </div>
      </section>
    )
  );
};

export default VariantsSection;
