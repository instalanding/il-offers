"use client";

import React, { useRef, useState, useEffect } from "react";
import createGradient from "@/lib/createGradient";
import Header from "./Header";
import HeroSection from "./HeroSection";
import Reviews from "./Reviews";
import ReviewsNav from "./ReviewsNav";
import VariantsSection from "./VariantsSections";
import ProductDetails from "./ProductDetails";
import Checkout from "./Checkout";

const NewLandingPage = ({
  schema,
  logo,
  offer_id,
  store_url,
  advertiser,
  user_ip,
  utm_params,
  showDefault,
}: any) => {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [currentSchema, setCurrentSchema] = useState(schema);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [currentVariantId, setCurrentVariantId] = useState<string | null>(
    schema.variant_id
  );

  const offer_ids = ["a423d8"];

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
  }, [currentVariantId, schema.product_handle, showDefault]);

  return (
    <div
      ref={topRef}
      className="w-full overflow-auto h-[100dvh] p-[2%] max-sm:p-0"
      style={{
        backgroundImage: createGradient(currentSchema?.config?.backgroundColor),
      }}
    >
      <div
        className={`w-[380px] ${offer_ids.includes(offer_id) ? "bg-[#122442]" : "bg-white"
          } flex flex-col max-sm:w-full h-full shadow-lg max-sm:shadow-none rounded-2xl max-sm:rounded-none overflow-auto mx-auto`}
      >
        <Header
          currentSchema={currentSchema}
          offer_id={offer_id}
          logo={logo}
          offer_ids={offer_ids}
        />

        <HeroSection
          currentSchema={currentSchema}
          offer_id={offer_id}
          offer_ids={offer_ids}
        />

        <div
          className="cursor-pointer"
          onClick={() => {
            return reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <ReviewsNav product_handle={currentSchema.product_handle} />
        </div>

        {currentSchema.showVariants && !currentSchema.variant_position && (
          <VariantsSection
            currentSchema={currentSchema}
            currentVariantId={currentVariantId}
            setCurrentVariantId={setCurrentVariantId}
            offer_id={offer_id}
            offer_ids={offer_ids}
          />
        )}

        <ProductDetails
          showDefault={showDefault}
          currentSchema={currentSchema}
          offer_ids={offer_ids}
          iframeUrl={iframeUrl}
        />

        <div id="reviews" ref={reviewsRef}></div>
        <div className={`${offer_ids.includes(offer_id) ? "bg-[#122442]" : "bg-white"} rounded-lg shadow-sm`}>
          <Reviews product_handle={currentSchema.product_handle} />
        </div>

        {currentSchema.showVariants &&
          currentSchema.variant_position &&
          <VariantsSection
            currentSchema={currentSchema}
            currentVariantId={currentVariantId}
            setCurrentVariantId={setCurrentVariantId}
            offer_id={offer_id}
            offer_ids={offer_ids}
          />}

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
          />
        </div>
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};

export default NewLandingPage;