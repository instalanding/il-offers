import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface HeroSectionProps {
  currentSchema: any;
  offer_id: string;
  offer_ids: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ currentSchema, offer_id, offer_ids }) => {
  return (
    <>
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
        <h1 className={`text-[20px] font-semibold ${offer_ids.includes(offer_id) ? "text-white" : "text-black"}`}>
          {currentSchema.creative?.title}
        </h1>
      </div>
    </>
  );
};

export default HeroSection;
