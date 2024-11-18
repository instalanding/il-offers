"use client";

import createGradient from "@/lib/createGradient";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Reviews from "./Reviews";
import Checkout from "./Checkout";
import Link from "next/link";
import { modifyCloudinaryUrl } from "@/lib/modifyCloudinaryUrl";

const NewLandingPage = ({
  schema,
  logo,
  offer_id,
  store_url,
  advertiser,
  user_ip,
  tags,
  utm_params
}: any) => {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [accordionState, setAccordionState] = useState<string>("item-1");
  const [currentVariantId, setCurrentVariantId] = useState<string | null>(schema.variant_id);
  const [currentSchema, setCurrentSchema] = useState(schema); // State to hold the current schema

  const offer_ids = ["a423d8"]
  // Function to handle the accordion toggle
  const handleAccordionToggle = (value: string) => {
    setAccordionState((prevState) => (prevState === value ? "item-2" : value));
  };

  // Scroll to top handler
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to bottom handler
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  function calculatePercentageOff(
    originalPrice: number,
    offerPrice: number
  ): number {
    let percentageOff = ((originalPrice - offerPrice) / originalPrice) * 100;
    return Math.round(percentageOff);
  }

  // Function to truncate text and add ellipsis if it exceeds a certain length
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  // Fetch new data when the variant_id changes
  useEffect(() => {
    const fetchData = async () => {
      if (currentVariantId) {
        const response = await fetch(`/api/campaign?slug=${schema.product_handle}&variant_id=${currentVariantId}`);
        const data = await response.json();
        setCurrentSchema(data); // Update the current schema with the fetched data
      }
    };

    fetchData();
  }, [currentVariantId, schema.product_handle]); // Dependency on currentVariantId

  // Sort campaigns by offer price
  const sortedCampaigns = currentSchema.all_campaigns?.sort((a: any, b: any) => {
    const offerPriceA = parseFloat(a.price.offerPrice.value);
    const offerPriceB = parseFloat(b.price.offerPrice.value);
    return offerPriceA - offerPriceB; // Ascending order
  }) || [];

  return (
    <div
      ref={topRef}
      className="w-full overflow-auto h-[100dvh] p-[2%] max-sm:p-0"
      style={{ backgroundImage: createGradient(currentSchema?.config?.backgroundColor) }} // Use currentSchema for background
    >
      <div className={`w-[380px] ${offer_ids.includes(offer_id) ? 'bg-[#122442]': 'bg-white'} flex flex-col max-sm:w-full h-full shadow-lg max-sm:shadow-none rounded-2xl max-sm:rounded-none overflow-auto mx-auto`}>
        <div className="sticky top-0 z-50">
          {currentSchema?.creative?.text && (
            <div>
              <p
                style={{
                  backgroundColor: currentSchema.config.backgroundColor,
                  color: currentSchema?.config?.textColor,
                }}
                className="text-[12px] text-white text-center p-2 px-6"
              >
                {currentSchema.creative.text}
              </p>
            </div>
          )}
          <div className={`flex flex-col items-center justify-center py-2 ${offer_ids.includes(offer_id) ? 'bg-[#122442]': 'bg-white'}`}>
            <Link
              href={`https://${currentSchema.store_url}/?utm_source=instalanding&utm_medium=landing_page&utm_campaign=${offer_id}`}
            >
              <Image
                alt={`logo`}
                src={logo}
                width={1000}
                height={1000}
                className="h-[60px] py-2 height-auto object-contain"
              />
            </Link>
          </div>
        </div>
        {currentSchema.creative.carousel_images.length !== 0 && (
          <div className="">
            <Carousel>
              <CarouselContent>
                {currentSchema.creative.carousel_images &&
                  currentSchema.creative.carousel_images.map(
                    (image: string, key: number) => (
                      <CarouselItem key={key}>
                        <Image
                          alt={"Image"}
                          src={modifyCloudinaryUrl(image, 680, 680)}
                          width={480}
                          height={480}
                          className="w-full"
                          priority={key === 0}
                        />
                      </CarouselItem>
                    )
                  )}
              </CarouselContent>
              <CarouselPrevious className="left-[7px] shadow-md" />
              <CarouselNext className="right-[7px] shadow-md" />
            </Carousel>
          </div>
        )}
        <div className="mx-3 mt-3">
          <h1 className={`text-[20px] font-semibold text-center ${offer_ids.includes(offer_id) ? 'text-white': 'text-black'}`}>
            {currentSchema.creative.title}
          </h1>
        </div>
        <div>
          <div className={`${offer_ids.includes(offer_id) ? 'bg-[#122442]': 'bg-white'} py-4 rounded-lg shadow-sm`}>
            {currentSchema.reviews && currentSchema.reviews.length > 0 && (
              <Reviews product_handle={currentSchema.product_handle} />
            )}
          </div>
        </div>

        {currentSchema.creative.terms_and_conditions && (
          <div className={` my-3 ${offer_ids.includes(offer_id) ? 'bg-[#122442]': 'bg-white'} px-4 rounded-lg`}>
            {/* <h1 className="text-[17px] mb-2 font-semibold">Details</h1> */}
            <div
              className="text-editor-css"
              dangerouslySetInnerHTML={{
                __html: currentSchema.creative.terms_and_conditions,
              }}
            ></div>
          </div>
        )}

{!offer_ids.includes(offer_id) ? <>
  {currentSchema.all_campaigns && sortedCampaigns.length > 1 && (
          <div className="my-3 bg-white px-4 rounded-lg">
            <h1 className="flex flex-col text-[17px] mb-2 font-semibold">Available Options
              {currentVariantId && (
                <div className="text-xs my-2 font-semibold">
                  {currentSchema.all_campaigns.find((p: any) => p.variant_id === currentVariantId)?.variant_type
                    ? currentSchema.all_campaigns.find((p: any) => p.variant_id === currentVariantId)?.variant_type
                    : currentSchema.campaign_name
                  }
                </div>
              )}
            </h1>

            <div className="grid grid-cols-3 gap-2">
              {sortedCampaigns.map((product: any) => (
                <div
                  key={product._id}
                  className={`cursor-pointer border-2 rounded-lg p-2 hover:shadow-[0_6px_15px_rgba(0,0,0,0.4)] ${product.variant_id === currentVariantId ? 'border-2 border-black shadow-[0_4px_10px_rgba(0,0,0,0.4)]' : ''}`}
                  onClick={() => {
                    setCurrentVariantId(product.variant_id); // Update selected variant
                  }}
                >
                  <Link
                    href={`/products/${currentSchema.product_handle}?variant_id=${product.variant_id}`}
                  >
                    <Image
                      alt={product.variant_type ? product.variant_type : "Variant"}
                      src={product.creative.image}
                      width={60}
                      height={50}
                      className="justify-self-center"
                    />
                    <h2 className="text-[14px] font-semibold">
                      {truncateText(product.variant_type ? product.variant_type : product.campaign_name, 25)}
                    </h2>
                    <div className="flex items-center">
                      {(parseFloat(product?.price?.offerPrice?.value) < parseFloat(product?.price?.originalPrice?.value)) ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-center items-center gap-1">
                            <p className="text-[13px] text-gray-600 line-through">
                              {product.price.originalPrice.prefix}{product.price.originalPrice.value}
                            </p>
                            <p className="text-[15px] font-semibold text-green-600">
                              {product.price.offerPrice.prefix}{product.price.offerPrice.value}
                            </p>
                          </div>
                          <p className="text-[13px] text-red-600">
                            {calculatePercentageOff(parseFloat(product.price.originalPrice.value), parseFloat(product.price.offerPrice.value))}% off
                          </p>
                        </div>
                      ) : (
                        <p className="text-[15px] font-semibold text-green-600">
                          {product.price.originalPrice.prefix}{product.price.originalPrice.value}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
</> : null}

        <div className="flex-grow"></div>
        <div className="sticky bottom-0">
          <Checkout
            pixel={currentSchema.pixel ? currentSchema.pixel.id : ""}
            originalPrice={currentSchema.price.originalPrice.value}
            price={currentSchema.price.offerPrice.value}
            backgroundColor={currentSchema.config.backgroundColor}
            textColor={currentSchema.config.textColor}
            logo={logo}
            schema={currentSchema}
            offer_id={offer_id}
            scrollToBottom={scrollToBottom}
            handleAccordionToggle={handleAccordionToggle}
            advertiser={advertiser}
            store_url={store_url}
            user_ip={user_ip}
            text={currentSchema.creative.footer_text}
            button_text={currentSchema.config.button1Text}
            utm_params={utm_params}
          />
        </div>
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};

export default NewLandingPage;
