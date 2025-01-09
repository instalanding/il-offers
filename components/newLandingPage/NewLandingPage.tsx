"use client";

import createGradient from "@/lib/createGradient";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

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
import IframeResizer from "@iframe-resizer/react";
import ReviewsNav from "./ReviewsNav";

const NewLandingPage = ({
  schema,
  logo,
  offer_id,
  store_url,
  advertiser,
  user_ip,
  tags,
  utm_params,
  showDefault, // shows default variance
}: any) => {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [accordionState, setAccordionState] = useState<string>("item-1");
  const [currentVariantId, setCurrentVariantId] = useState<string | null>(
    schema.variant_id
  );
  const [currentSchema, setCurrentSchema] = useState(schema); // State to hold the current schema
  // const [currentVariance, setCurrentVariance] = useState<string | null>(null);
  const [isVarianceLocked, setIsVarianceLocked] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const offer_ids = ["a423d8"];

  function calculatePercentageOff(originalPrice: number, offerPrice: number) {
    let percentageOff = ((originalPrice - offerPrice) / originalPrice) * 100;
    return Math.round(percentageOff);
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

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

  const fetchVariance = async (isCheckoutClicked: boolean = false) => {
    try {
      const visitorId = await getVisitorId();

      const response = await fetch(`/api/campaign/variance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitor_id: visitorId,
          campaign_id: currentSchema._id,
          showDefault,
          isCheckoutClicked,
        }),
      });

      const data = await response.json();
      setIsVarianceLocked(
        isCheckoutClicked || data.variance === data.last_variance
      );

      setIframeUrl(data.variance);
      return data.variance;
    } catch (error) {
      console.error("Failed to fetch variance:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currentVariantId) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}variancecampaigns?slug=${schema.product_handle}&variant_id=${currentVariantId}`
        );
        const data = await response.json();
        setCurrentSchema(data);
      }
    };

    fetchData();
    fetchVariance(); // Initial variance fetch
  }, [currentVariantId, schema.product_handle, showDefault]);

  const iframeRef = useRef(null);

  const renderVariantsSection = () => {
    return (
      currentSchema.all_campaigns &&
      currentSchema.all_campaigns.length > 1 && (
        <div
          className={`px-4 my-3 ${offer_ids.includes(offer_id) ? "bg-[#122442]" : "bg-white"
            } rounded-lg`}
        >
          <h1 className="flex flex-col text-[17px] mb-2 font-semibold">
            Available Options
          </h1>
          {currentVariantId && (
            <div className="text-xs mb-2 space-y-[7px]">
              {currentSchema.all_campaigns.find(
                (p: any) => p.variant_id === currentVariantId
              )?.variant_type
                ? currentSchema.all_campaigns
                  .find((p: any) => p.variant_id === currentVariantId)
                  ?.variant_type.split(/[\|-]/)
                  .map((part: string, index: number) => (
                    <p key={index}>{part}</p>
                  ))
                : currentSchema.campaign_name}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {currentSchema.all_campaigns.map((product: any) => (
              <div
                key={product._id}
                className={`flex-shrink-0 flex justify-center items-center cursor-pointer border rounded-lg p-2 hover:shadow-[0_2px_15px_rgba(0,0,0,0.2)] ${product.variant_id === currentVariantId
                    ? "border border-[#0000005a] shadow-[0_1px_10px_rgba(0,0,0,0.1)]"
                    : ""
                  } ${offer_ids.includes(offer_id) && "bg-white"}`}
                onClick={() => {
                  setCurrentVariantId(product.variant_id); // Update selected variant
                }}
              >

                <Link
                  href={`/products/${currentSchema.product_handle}?variant=${product.variant_id}`}
                >

                  {/* <Image
                    alt={
                      product.variant_type ? product.variant_type : "Variant"
                    }
                    src={product.creative.image}
                    width={60}
                    height={50}
                    className="justify-self-center"
                  /> */}
                  <h2 className="text-[13px] line-clamp-2 text-center">
                    {product.variant_type
                      ? product.variant_type
                      : product.campaign_name}
                  </h2>
                  <div className="flex items-center justify-center">
                    {product?.price?.offerPrice?.value ? (
                      <div className="flex flex-col gap-1">
                        {product?.price?.originalPrice?.value &&
                          parseFloat(product.price.offerPrice.value) <
                          parseFloat(product.price.originalPrice.value) ? (
                          <div className="flex flex-wrap justify-center items-center">
                            <p className="text-[12px] text-gray-600 line-through pr-1">
                              {product.price.originalPrice.prefix}
                              {product.price.originalPrice.value}
                            </p>
                            <p
                              style={{ color: schema.config?.backgroundColor }}
                              className="text-[15px] font-semibold pr-1"
                            >
                              {product.price.offerPrice.prefix}
                              {product.price.offerPrice.value}
                            </p>
                            <p className="text-[13px] text-red-600">
                              {calculatePercentageOff(
                                parseFloat(product.price.originalPrice.value),
                                parseFloat(product.price.offerPrice.value)
                              )}
                              % off
                            </p>
                          </div>
                        ) : (
                          <p
                            style={{ color: schema.config?.backgroundColor }}
                            className="text-[18px] font-semibold text-green-600"
                          >
                            {product.price.offerPrice.prefix}
                            {product.price.offerPrice.value}
                          </p>
                        )}
                      </div>
                    ) : product?.price?.originalPrice?.value ? (
                      <p className="text-[15px] font-semibold text-green-600">
                        {product.price.originalPrice.prefix}
                        {product.price.originalPrice.value}
                      </p>
                    ) : (
                      <p className="text-[15px] text-center text-gray-600">
                        Price not available
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )
    );
  };

  return (
    <div
      ref={topRef}
      className="w-full overflow-auto h-[100dvh] p-[2%] max-sm:p-0"
      style={{
        backgroundImage: createGradient(currentSchema?.config?.backgroundColor),
      }} // Use currentSchema for background
    >
      <div
        className={`w-[380px] ${offer_ids.includes(offer_id) ? "bg-[#122442]" : "bg-white"
          } flex flex-col max-sm:w-full h-full shadow-lg max-sm:shadow-none rounded-2xl max-sm:rounded-none overflow-auto mx-auto`}
      >
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
          <div
            className={`flex flex-col items-center justify-center ${offer_ids.includes(offer_id) ? "bg-[#122442]" : "bg-white"
              }`}
          >
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
        {currentSchema.creative?.carousel_images.length !== 0 && (
          <div className="">
            <Carousel>
              <CarouselContent>
                {currentSchema.creative?.carousel_images &&
                  currentSchema.creative?.carousel_images.map(
                    (image: string, key: number) => (
                      <CarouselItem key={key}>
                        <Image
                          alt={"Image"}
                          src={image}
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
          <h1
            className={`text-[20px] font-semibold ${offer_ids.includes(offer_id) ? "text-white" : "text-black"
              }`}
          >
            {currentSchema.creative?.title}
          </h1>
        </div>

        <div
          className="cursor-pointer"
          onClick={() => {
            return reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <ReviewsNav product_handle={currentSchema.product_handle} />
        </div>

        {currentSchema.showVariants && !currentSchema.variant_position && (
          <div>{renderVariantsSection()}</div>
        )}

        {showDefault ? (
          <>
            {currentSchema.creative.terms_and_conditions && (
              <div
                className={`my-3 ${offer_ids.includes(offer_id) ? "bg-[#122442]" : "bg-white"
                  } px-4 rounded-lg`}
              >
                <div
                  className="text-editor-css"
                  dangerouslySetInnerHTML={{
                    __html: currentSchema.creative.terms_and_conditions,
                  }}
                ></div>
              </div>
            )}
          </>
        ) : (
          <div className="">
            {/* {currentVariance && ( */}
            <div
              className={`${offer_ids.includes(offer_id) ? "text-white" : "text-black"
                }`}
            >
              {/* {currentVariance}
                {isVarianceLocked && (
                  <div className="text-sm text-gray-500 mt-2">
                    This variance is locked for your session
                  </div>
                )} */}
              {iframeUrl ? (
                <div className="my-3">
                  <IframeResizer
                    license="GPLv3"
                    src={iframeUrl}
                    // src="https://aigeneratedhtml.s3.amazonaws.com/campaigns/1732268127955-First_%3A_Benefit-Focused.html"
                    width="100%"
                    // height="600px"
                    title="Variance Content"
                    // forwardRef={iframeRef}
                    style={{ width: "100%", height: "130vh" }}
                  />
                </div>
              ) : (
                <>
                  {currentSchema.creative?.terms_and_conditions && (
                    <div
                      className={` ${offer_ids.includes(offer_id)
                          ? "bg-[#122442]"
                          : "bg-white"
                        } rounded-lg`}
                    >
                      <div
                        className="text-editor-css"
                        dangerouslySetInnerHTML={{
                          __html: currentSchema.creative?.terms_and_conditions,
                        }}
                      ></div>
                    </div>
                  )}
                </>
              )}
            </div>
            {/* )} */}
          </div>
        )}
        <div id="reviews" ref={reviewsRef}></div>

        <div>
          <div
            className={`${offer_ids.includes(offer_id) ? "bg-[#122442]" : "bg-white"
              } rounded-lg shadow-sm`}
          >
            <Reviews product_handle={currentSchema.product_handle} />
          </div>
        </div>

        {currentSchema.showVariants &&
          currentSchema.variant_position &&
          renderVariantsSection()}

        <div className="flex-grow"></div>
        <div className="sticky bottom-0">
          <Checkout
            pixel={currentSchema.pixel ? currentSchema.pixel.id : ""}
            originalPrice={currentSchema.price?.originalPrice.value}
            price={currentSchema.price?.offerPrice.value}
            backgroundColor={currentSchema.config?.backgroundColor}
            textColor={currentSchema.config?.textColor}
            logo={logo}
            schema={currentSchema}
            offer_id={offer_id}
            advertiser={advertiser}
            store_url={store_url}
            user_ip={user_ip}
            text={currentSchema.creative?.footer_text}
            button_text={currentSchema.config?.button1Text}
            utm_params={utm_params}
            onCheckoutClick={fetchVariance}
            isVarianceLocked={isVarianceLocked}
            campaign_id={currentSchema._id}
          />
        </div>
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};

export default NewLandingPage;
