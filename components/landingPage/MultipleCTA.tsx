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


function MultipleCTA({ schema, logo, offer_id, userIp, pixel }: any) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);


  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`api/reviews/?product_id=${schema.creative?.amazon_product_id}`);
      console.log(response.data);
      setReviews(response.data);
    } catch (error: any) {
      console.error("Error saving the offer:", error);
      console.log(error.response.status, "status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div
      className="w-full flex justify-center overflow-y-auto items-center sm:rounded-xl rounded-none"
      style={{ backgroundImage: createGradient(schema.backgroundColor) }}
    >
      <div className="bg-white sm:max-w-[380px] w-full sm:shadow-md shadow-none sm:rounded-xl rounded-none transition-transform duration-300 mb-3">
        <div className="flex justify-center items-center">
          <Image
            alt={`logo`}
            src={logo}
            width={100}
            height={100}
            className="w-[150px] height-auto object-contain py-3"
          />
        </div>
        <Carousel>
          <CarouselContent>
            {schema.creative.carousel_images &&
              schema.creative.carousel_images.map(
                (image: string, key: number) => (
                  <CarouselItem key={key}>
                    <Image
                      alt={"Image"}
                      src={image}
                      width={380}
                      height={310}
                      className="sm:rounded-xl rounded-none sm:w-[380px] w-full"
                    />
                  </CarouselItem>
                )
              )}
          </CarouselContent>
          <CarouselPrevious className="left-[7px] shadow-md" />
          <CarouselNext className="right-[7px] shadow-md" />
        </Carousel>
        <div className="px-4 my-2">
          <h1 className="text-center text-[20px] font-bold">
            {schema.creative.title}
          </h1>
          <h2 className="text-center mt-2 font-semibold">
            {schema.creative.text}
          </h2>
        </div>
        <Tabs defaultValue="shop" className="mt-3 px-2 pb-3">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="reviews" className="mt-0">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="details" className="mt-0">
              Details
            </TabsTrigger>
          </TabsList>
          <TabsContent value="shop">
            <CTAGeoTracking
              pixel={pixel}
              userIp={userIp}
              campaignGeoRegion={schema.geo_trackings}
              schema={schema}
              offer_id={offer_id}
            />
            <Link href="https://www.instalanding.in/" target="_blank">
              <p className="text-center w-full mt-7 text-slate-600 text-sm cursor-pointer sm:block">
                Powered by{" "}
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                  Instalanding.in
                </span>
              </p>
            </Link>
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            {/* {(offer_id === "76faf" || offer_id === "95dda") && (
              <Reviews
                loading={loading}
                reviews={reviews}
                schema={schema}
                offer_id={offer_id}
              />
            )} */}
            <Reviews
              loading={loading}
              reviews={reviews}
              schema={schema}
              offer_id={offer_id}
            />
          </TabsContent>
          <TabsContent value="details" className="p-4">
            <Details
              schema={schema}
              logo={logo}
              offer_id={offer_id}
              userIp={userIp}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default MultipleCTA;
