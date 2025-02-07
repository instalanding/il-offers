import React from "react";
import { TbShoppingBagPlus } from "react-icons/tb";
import { calculatePercentageOff } from "@/lib/calculateDiscount";
import { formatPrice } from "@/lib/formatUtils";
import useCheckout from "@/hooks/Checkout";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Config {
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
  buttonText: string;
}

interface Price {
  offerPrice: {
    prefix: string;
    value: string;
  };
  originalPrice: {
    prefix: string;
    value: string;
  };
}

interface Checkout {
  campaign_id: string;
  variant_id: string;
  offer_id: string;
  store_url: string;
  checkout_name: string;
  userIp: string;
  pixel_id: string;
  advertiser_id: string;
  coupon_code: string;
  utm_params: Object;
}

const Footer: React.FC<{
  config: Config;
  price: Price;
  checkoutData: Checkout;
}> = ({ config, price, checkoutData }) => {
  const { handleCheckout } = useCheckout();
  const router = useRouter();

  const getVisitorId = async () => {
    if (typeof window === "undefined") return;

    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      return result.visitorId;
    } catch (error) {
      console.error("Error getting visitor identifier:", error);
      return null;
    }
  };

  const handleCheckoutButtonClick = async (e: React.MouseEvent) => {
    try {
      if (checkoutData.checkout_name === "shiprocket") {
        handleCheckout(
          e as React.MouseEvent<HTMLButtonElement, MouseEvent>,
          checkoutData.variant_id,
          checkoutData.offer_id,
          checkoutData.coupon_code,
          checkoutData.utm_params
        );
      } else if (checkoutData.checkout_name === "shopify") {
        router.push(
          `https://${checkoutData.store_url}/cart/${checkoutData.variant_id}:1?discount=${checkoutData.coupon_code}`
        );
      }

      recordClicks();
      if (checkoutData.pixel_id) {
        const noscript = document.createElement("noscript");
        const img = document.createElement("img");
        img.height = 1;
        img.width = 1;
        img.style.display = "none";
        img.src = `https://www.facebook.com/tr?id=${checkoutData.pixel_id}&ev=Checkout&noscript=1`;
        img.alt = "Facebook Pixel";
        noscript.appendChild(img);
        document.body.appendChild(noscript);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  async function recordClicks() {
    try {
      const visitorId = await getVisitorId();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}analytics/clicks/?offer_id=${checkoutData.offer_id}&advertiser_id=${checkoutData.advertiser_id}&user_ip=${checkoutData.userIp}&product_url=${checkoutData.store_url}&visitor_id=${visitorId}&campaign_id=${checkoutData.campaign_id}`,
        {}
      );
    } catch (error) {}
  }

  return (
    <>
      <input type="hidden" value={checkoutData.store_url} id="sellerDomain" />
      <div className="sticky bottom-0 bg-white">
        <div className="flex flex-col">
          <div
            style={{
              backgroundColor: config?.primaryColor + "3a",
              color: config.secondaryColor || "#000000",
            }}
            className="p-1 bg-opacity-25 flex justify-center items-center gap-2"
          >
            <p className="text-sm text-center">{config.footerText}</p>
          </div>

          {/* Price and Button Section */}
          <div className="flex items-center justify-between text-black p-3 rounded-lg gap-5">
            <div className="flex items-center justify-center">
              {price?.offerPrice?.value ? (
                <div className="flex flex-col gap-1">
                  {price?.originalPrice?.value &&
                  parseFloat(price.offerPrice.value) <
                    parseFloat(price.originalPrice.value) ? (
                    <div className="flex flex-col justify-center items-center">
                      <p
                        style={{ color: config?.primaryColor }}
                        className="font-bold text-[20px] text-center"
                      >
                        {formatPrice(
                          parseFloat(price.offerPrice.value),
                          price.offerPrice.prefix
                        )}
                      </p>
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
                  ) : (
                    <p
                      style={{ color: config?.primaryColor }}
                      className="text-[20px] font-bold"
                    >
                      {formatPrice(
                        parseFloat(price.offerPrice.value),
                        price.offerPrice.prefix
                      )}
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
                <p className="text-[15px] text-center text-gray-600">
                  Price not available
                </p>
              )}
            </div>

            <Button
              onClick={handleCheckoutButtonClick}
              className="flex items-center justify-center gap-2 px-8 py-2 bg-black w-full rounded-lg transition-colors"
              style={{
                backgroundColor: config.primaryColor,
                color: config.secondaryColor,
              }}
            >
              <TbShoppingBagPlus size={20} />
              {config.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
