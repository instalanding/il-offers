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
import Reviews from "./tabsComponent/reviews";
import axios from "axios";
import InstalandingCheckout from "./InstalandingCheckout/InstalandingCheckout";
import { modifyCloudinaryUrl } from "@/lib/modifyCloudinaryUrl";

function MultipleCTA({ schema, logo, offer_id, userIp, pixel }: any) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
      className="w-full flex justify-center overflow-y-auto  sm:p-[5%] items-center"
      style={{ backgroundImage: createGradient(schema.backgroundColor) }}
    >
      <div className="bg-white flex flex-col gap-4 sm:max-w-[380px] w-full sm:shadow-md shadow-none sm:rounded-xl rounded-none transition-transform duration-300 mb-3">
        <div className="flex justify-center items-center">
          <Link
            href={
              "https://bombaysweetshop.com/?srsltid=AfmBOop3K9Q3OydDQVCfNS5AxmHliZGwlUw1hBJcP56IkOcOGpf-qcpt?utm_source=instalanding&utm_medium=instalanding"
            }
            target="_blank"
          >
            <Image
              alt={`logo`}
              src={logo}
              width={100}
              height={100}
              className="h-[70px] height-auto object-contain py-3"
            />
          </Link>
        </div>
        <div>
          <Carousel>
            <CarouselContent>
              {schema.creative.carousel_images &&
                schema.creative.carousel_images.map(
                  (image: string, key: number) => (
                    <CarouselItem key={key}>
                      <Image
                        alt={"Image"}
                        src={modifyCloudinaryUrl(image, width, height)}
                        width={width}
                        height={height}
                        priority
                        className="sm:rounded-xl rounded-none sm:w-[380px] w-full"
                      />
                    </CarouselItem>
                  )
                )}
            </CarouselContent>
            <CarouselPrevious className="left-[7px] shadow-md" />
            <CarouselNext className="right-[7px] shadow-md" />
          </Carousel>
        </div>
        <div className="">
          <h1 className="text-center text-[20px] font-bold">
            {schema.creative.title}
          </h1>
          <h2 className="text-center mt-2 font-semibold">
            {schema.creative.text}
          </h2>
        </div>
        <div className="px-5">
          <CTAGeoTracking
            pixel={pixel}
            userIp={userIp}
            campaignGeoRegion={schema.geo_trackings}
            schema={schema}
            offer_id={offer_id}
          />
        </div>
        <div className="mt-3 px-5">
          <Reviews
            loading={loading}
            reviews={reviews}
            schema={schema}
            offer_id={offer_id}
          />
        </div>
        <div className="px-5">
          <Details
            schema={schema}
            logo={logo}
            offer_id={offer_id}
            userIp={userIp}
          />
        </div>
        <Link href="https://www.instalanding.in/" target="_blank">
          <p className="text-center w-full mt-7 text-slate-600 text-sm cursor-pointer sm:block">
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
