import React, { useState } from "react";
import { calculatePercentageOff } from "@/lib/calculateDiscount";
import { formatPrice } from "@/lib/formatUtils";
import useCheckout from "@/hooks/Checkout";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
// import { TbShoppingBagPlus } from "react-icons/tb";
import { isMobile } from "react-device-detect";
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
  quantity: boolean;
}

interface Checkout {
  campaign_id: string;
  variant_id: string;
  offer_id: string;
  store_url: string;
  checkout_name: string;
  userIp: string;
  pixel: string | string[];
  advertiser_id: string;
  coupon_code: string;
  utm_params: Object;
  inventory?: number;
}

const Footer: React.FC<{
  config: Config;
  price: Price;
  checkoutData: Checkout;
  quantity: number;
  handleIncrease: any;
  handleDecrease: any;
}> = ({ config, price, quantity, handleIncrease, handleDecrease, checkoutData }) => {
  const { handleCheckout, handleMouseEnter, handleTouchStart } = useCheckout();
  const [loading, setLoading] = useState<boolean>(false);
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

  const handleCheckoutButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true)
    try {
      if (isMobile) {
        handleTouchStart();
      }
      if (
        checkoutData.checkout_name === "shiprocket" ||
        checkoutData.checkout_name === "fastr" ||
        checkoutData.checkout_name === "fastrr"
      ) {
        setTimeout(() => {
          console.log("checkout called")
          handleCheckout(
            e as React.MouseEvent<HTMLButtonElement, MouseEvent>,
            checkoutData.variant_id,
            checkoutData.offer_id,
            checkoutData.coupon_code,
            checkoutData.utm_params,
            quantity
          );
        }, 2000);
      } else if (checkoutData.checkout_name === "shopify") {
        router.push(
          `https://${checkoutData.store_url}/cart/${checkoutData.variant_id}:${quantity}?discount=${checkoutData.coupon_code}`
        );
      } else {
        router.push(
          `https://${checkoutData.store_url}/cart/${checkoutData.variant_id}:${quantity}?discount=${checkoutData.coupon_code}`
        );
      }
      recordClicks();
      if (checkoutData.pixel && Array.isArray(checkoutData.pixel)) {
        checkoutData.pixel.forEach((pixelId) => {
          const noscript = document.createElement("noscript");
          const img = document.createElement("img");
          img.height = 1;
          img.width = 1;
          img.style.display = "none";
          img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=Checkout&noscript=1`;
          img.alt = "Facebook Pixel";
          noscript.appendChild(img);
          document.body.appendChild(noscript);
        });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false)
    }
  };

  async function recordClicks() {
    try {
      const visitorId = await getVisitorId();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}analytics/clicks/?offer_id=${checkoutData.offer_id}&advertiser_id=${checkoutData.advertiser_id}&user_ip=${checkoutData.userIp}&product_url=${checkoutData.store_url}&visitor_id=${visitorId}&campaign_id=${checkoutData.campaign_id}`,
        {}
      );
    } catch (error) { }
  }

  const isSoldOut = checkoutData.inventory !== undefined && checkoutData.inventory === 0;

  return (
    <>
      <input type="hidden" value={checkoutData.store_url} id="sellerDomain" />
      <div className="sticky bottom-0 bg-gray-100">
        <div className="flex flex-col">
          <div
            style={{
              backgroundColor: config?.primaryColor + "9a",
              color: config.secondaryColor || "#000000",
            }}
            className="p-[1px] shadow-md flex justify-center items-center gap-2"
          >
            <p className="text-sm text-center">{config.footerText}</p>
          </div>

          {/* Price and Button Section */}
          <div className="flex items-center justify-between text-black p-[10px] rounded-lg gap-2 w-full">
            <div className="flex items-center justify-center shrink-0 w-auto">
              {price?.offerPrice?.value ? (
                <div className="flex flex-col gap-1 px-2">
                  {price?.originalPrice?.value &&
                    parseFloat(price.offerPrice.value) <
                    parseFloat(price.originalPrice.value) ? (
                    <div className="flex flex-col justify-center items-start">
                      {/* Offer Price on top */}
                      <p
                        style={{ color: config?.primaryColor }}
                        className="font-bold text-[20px] text-center"
                      >
                        {formatPrice(
                          parseFloat(price.offerPrice.value),
                          price.offerPrice.prefix
                        )}
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
                ''
              )}
            </div>
            <div className="flex gap-2">
              {/* Quantity Selector */}
              {price.quantity === true && (
                <div className="flex items-center gap-2 border rounded-lg py-2 px-1 w-auto">
                  <button
                    onClick={handleDecrease}
                    disabled={quantity === 1}
                    className="disabled:opacity-50"
                  >
                    <IoIosRemove size={18} />
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button onClick={handleIncrease} >
                    <IoIosAdd size={18} />
                  </button>
                </div>
              )}
              {
                loading ?
                  <Button
                    className={`max-w-[300px] border flex items-center justify-center text-[18px] gap-2 px-8 py-2 h-full flex-1 rounded-lg`}
                    disabled={loading}
                    style={{
                      backgroundColor: config.primaryColor,
                      color: config.secondaryColor,
                    }}
                  >Loading...</Button> : <Button
                    onClick={handleCheckoutButtonClick}
                    onMouseEnter={handleMouseEnter}
                    onTouchStart={handleTouchStart}
                    disabled={isSoldOut}
                    className={`max-w-[300px] border flex items-center justify-center text-[18px] gap-2 px-8 py-2 h-full flex-1 rounded-lg transition-colors
                ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                      backgroundColor: config.primaryColor,
                      color: config.secondaryColor,
                    }}
                  >
                    {isSoldOut ? 'Sold Out' : <>{config.buttonText}</>}
                  </Button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;