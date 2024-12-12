"use client";

import createGradient from "@/lib/createGradient";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CTAGeoTracking from "./CTAGeoTracking";
import Details from "./tabsComponent/details";
import axios from "axios";
import InstalandingCheckout from "./InstalandingCheckout/InstalandingCheckout";
import { modifyCloudinaryUrl } from "@/lib/modifyCloudinaryUrl";
import Reviews from "../newLandingPage/Reviews";

function MultipleCTA({ schema, logo, offer_id, userIp, pixel }: any) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const width = 380;
  const height = 380;

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/reviews?shopify_product_handle=${schema.product_handle}`
      );
      console.log(response.data);
      setReviews(response.data);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);


  return (
    <div
      className="w-full overflow-auto h-[100dvh] p-[2%] max-sm:p-0"
      style={{ backgroundImage: createGradient(schema.backgroundColor) }}
    >
      <div className="relative w-[380px] bg-white flex flex-col max-sm:w-full h-full shadow-lg max-sm:shadow-none rounded-2xl max-sm:rounded-none overflow-auto mx-auto">
        <div className="sticky top-0 z-50">
          <div className="flex flex-col items-center justify-center py-2 bg-white">
            <Link
              href={`https://${schema.store_url}/?utm_source=instalanding&utm_medium=landing_page&utm_campaign=${offer_id}`}
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

        {schema.creative.carousel_images.length > 0 && (
          <div className="pb-2">
            <Carousel>
              <CarouselContent>
                {schema.creative.carousel_images.map(
                  (image: string, key: number) => (
                    <CarouselItem key={key}>
                      <Image
                        alt={"Image"}
                        src={modifyCloudinaryUrl(image, width, height)}
                        width={width}
                        height={height}
                        priority={key === 0}
                        className=" w-[380px] h-[380px] object-cover"
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
        <div className="py-2 px-5">
          <h1 className="text-[20px] font-semibold leading-tight">
            {schema.creative.title}
          </h1>
          <h2 className="mt-2 text-[14px]  leading-snug">
            {schema.creative.text}
          </h2>
        </div>

        {/* "py-2 px-5" is added in respective component parent classes and not here to avoid padding inconsistencies */}
        <div>
          <CTAGeoTracking
            pixel={pixel}
            userIp={userIp}
            campaignGeoRegion={schema.geo_trackings}
            schema={schema}
            offer_id={offer_id}
          />
        </div>
        <div>
          <Reviews product_handle={schema.product_handle} />
        </div>
        <div>
          <Details
            schema={schema}
            logo={logo}
            offer_id={offer_id}
            userIp={userIp}
          />
        </div>

        <Link href="https://www.instalanding.in/" target="_blank" className="absolute w-full bottom-0">
          <p className="text-center w-full mt-4 mb-[0.3rem] text-slate-600 text-xs cursor-pointer sm:block">
            Powered by{" "}
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
              Instalanding.in
            </span>
          </p>
        </Link>
      </div>
    </div>
  );
}

export default MultipleCTA;
