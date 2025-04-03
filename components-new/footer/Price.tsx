import { calculatePercentageOff } from "@/lib/calculateDiscount";
import { formatPrice } from "@/lib/formatUtils";

const Price = ({ price, config }: { price: any; config: any }) => {

  const roundedOfferPrice = price?.offerPrice?.value
      ? Math.round(parseFloat(price.offerPrice.value))
      : 0;

  return (
    <div>
      {price?.offerPrice?.value ? (
        <div className="flex flex-col gap-1 px-2">
          {price?.originalPrice?.value &&
          parseFloat(price.offerPrice.value) <
            parseFloat(price.originalPrice.value) ? (
            <div className="flex flex-col justify-center items-start">
              {/* Offer Price on top */}
              <p
                style={{ color: config?.primary_color }}
                className="font-bold text-[20px] text-center"
              >
                {formatPrice(roundedOfferPrice, price.offerPrice.prefix)}
              </p>
              {/* Original Price and Discount in same row below */}
              <div className="flex items-center gap-2">
                <p className="text-[11px] text-gray-600 line-through">
                  {formatPrice(
                    parseFloat(price.originalPrice.value),
                    price.originalPrice.prefix
                  )}
                </p>
                <p className="text-[11px] text-red-600">
                  {calculatePercentageOff(
                    parseFloat(price.originalPrice.value),
                    parseFloat(price.offerPrice.value)
                  )}
                  % off
                </p>
              </div>
            </div>
          ) : (
            <p
              style={{ color: config?.primary_color }}
              className="text-[20px] font-bold"
            >
              {formatPrice(roundedOfferPrice, price.offerPrice.prefix)}
            </p>
          )}
        </div>
      ) : price?.originalPrice?.value ? (
        <p className="text-[15px] font-semibold text-green-600">
          {formatPrice(
            parseFloat(price.originalPrice.value),
            price.originalPrice.prefix
          )}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default Price;
