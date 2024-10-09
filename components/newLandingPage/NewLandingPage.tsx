"use client";

import createGradient from "@/lib/createGradient";
import Image from "next/image";
import React, { useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Reviews from "./Reviews";
import Rating from "../landingPage/tabsComponent/rating";
import { CiDeliveryTruck } from "react-icons/ci";
import Checkout from "./Checkout";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import InstalandingCheckout from "../landingPage/InstalandingCheckout/InstalandingCheckout";
import Link from "next/link";

interface MyComponentProps {
  schema: {
    store_description: string;
  };
}

const NewLandingPage = ({
  schema,
  logo,
  offer_id,
  store_url,
  advertiser,
  user_ip,
  tags,
}: any) => {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [accordionState, setAccordionState] = useState<string>("item-1");

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

  return (
    <div
      ref={topRef}
      className="w-full overflow-auto h-[100dvh] p-[2%] max-sm:p-0"
      style={{ backgroundImage: createGradient(schema.config.backgroundColor) }}
    >
      <div className="w-[380px] bg-white flex flex-col max-sm:w-full h-full shadow-lg max-sm:shadow-none rounded-2xl max-sm:rounded-none overflow-auto mx-auto">
        <div className="sticky top-0 z-50">
          {schema.creative.text && (
            <div>
              <p
                style={{
                  backgroundColor: schema.config.backgroundColor,
                  color: schema.config.textColor,
                }}
                className="text-[12px] text-white text-center p-2 px-6"
              >
                {schema.creative.text}
              </p>
            </div>
          )}
          <div className="flex flex-col items-center justify-center py-2 bg-white">
            <Link
              href={`https://saptamveda.com/?utm_source=instalanding&utm_medium=landing_page&utm_campaign=${offer_id}`}
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
        {schema.creative.carousel_images.length !== 0 && (
          <div className="">
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
                          className="w-full"
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
          <h1 className=" text-[20px] font-semibold text-center">
            {schema.creative.title}
          </h1>
        </div>

        {schema.creative.amazon_product_id && (
          <div>
            <div
              style={{ boxShadow: "0px 4px 0px 0px #063E0914" }}
              className="flex justify-between items-center relative border m-3 p-4 rounded-2xl "
            >
              <Image
                alt={"Image"}
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
                }
                width={100}
                height={100}
                className="h-[25px] object-contain mt-2"
              />
              <div className="flex items-center gap-3 justify-center">
                <p className="text-[14px] text-center font-normal text-blue-900">
                  2,527 ratings
                </p>
                <Rating rating={4} />
              </div>
            </div>
            <div className="bg-white py-4 rounded-lg shadow-sm">
              <Reviews productId={schema.creative.amazon_product_id} />
            </div>
          </div>
        )}

        {schema.creative.terms_and_conditions && (
          <div className=" my-3 bg-white px-4 rounded-lg">
            <h1 className="text-[17px] mb-2 font-semibold">
              Details
            </h1>
            <div
              className="text-editor-css"
              dangerouslySetInnerHTML={{
                __html: schema.creative.terms_and_conditions,
              }}
            ></div>
          </div>
        )}
        <div className="flex-grow"></div>
        <div className="sticky bottom-0">
          <Checkout
            pixel={schema.pixel ? schema.pixel.id : ""}
            originalPrice={schema.price.originalPrice.value}
            price={schema.price.offerPrice.value}
            backgroundColor={schema.config.backgroundColor}
            textColor={schema.config.textColor}
            logo={logo}
            schema={schema}
            offer_id={offer_id}
            scrollToBottom={scrollToBottom}
            handleAccordionToggle={handleAccordionToggle}
            advertiser={advertiser}
            store_url={store_url}
            user_ip={user_ip}
            text={schema.creative.footer_text}
            button_text={schema.config.button1Text}
          />
        </div>

        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};

export default NewLandingPage;
