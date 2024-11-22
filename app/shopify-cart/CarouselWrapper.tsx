import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CarouselProps {
  urls: string[];
  instalandingAppId: string;
  userIp: string;
}

const CarouselWrapper: React.FC<CarouselProps> = ({
  urls,
  instalandingAppId,
  userIp,
}) => {
  console.log(urls);
  return (
    <div className="">
      <Carousel>
        <CarouselContent className="pb-6">
          {urls.map((m) => {
            if (m == "") {
              return <></>;
            }
            return (
              <CarouselItem key={m} className="flex justify-center">
                <iframe
                  className="w-[370px] h-screen rounded-2xl"
                  src={`${m}?instalanding_app_id=${instalandingAppId}&user_ip=${userIp}&shopify=true`}
                  style={{ overflow: "hidden" }}
                  scrolling="no"
                ></iframe>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div>
          <div className="absolute left-14 ">
            <CarouselPrevious />
          </div>
          <div className="absolute right-14 ">
            <CarouselNext />
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselWrapper;
