"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { MdOutlineDone } from "react-icons/md";

interface Advertiser {
  _id: string;
  name: string;
  store_logo: string;
}

interface Campaign {
  _id: string;
  name: string;
  creative: {
    title: string;
    text: string;
  };
  offer_id: string;
}

interface MappedAdvertisers {
  campaign: string;
  store_logo: string;
}

interface NewAdMapper {
  _id: string;
  advertiser: Advertiser;
  campaign: Campaign;
}

const Page: React.FC = () => {
  const [adMapper, setAdMapper] = useState<NewAdMapper[]>([]);
  const [url, setUrl] = useState<string[]>([]);
  const searchParams = useSearchParams();

  // Function to fetch admapper data
  async function getAdmapper(publisher_id: string | null) {
    try {
      const response = await axios.get<NewAdMapper[]>(
        `https://leopard.instalanding.in/admapper/new-admappers/populated/${publisher_id}`
      );
      setAdMapper(response.data);
    } catch (error) {
      console.error("Error fetching ad mapper", error);
    }
  }

  function getOfferIdsFromUrls(urls: (string | null)[]): string[] {
    return urls.map((url) => {
      if (!url) return "";
      const parsedUrl = new URL(url);
      // Assuming ID is the last part of the pathname
      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
      const id = pathSegments[pathSegments.length - 1];
      return id;
    });
  }

  useEffect(() => {
    localStorage.setItem("instanding_ad_url", JSON.stringify([]));
    const instalandingAppId = searchParams.get("instalanding_app_id");
    getAdmapper(instalandingAppId);
  }, []);

  useEffect(() => {
    localStorage.setItem("instalanding_ad_url", JSON.stringify(url));
  }, [url]);

  if (adMapper.length === 0) {
    return <></>;
  }

  const offer_ids = getOfferIdsFromUrls(url);

  return (
    <div className="p-4">
      <Carousel className="w-full">
        <CarouselContent>
          {adMapper.map((m) => {
            return (
              <CarouselItem key={m._id}>
                <div className="flex items-center gap-2 rounded-xl">
                  <div>
                    <img
                      width={60}
                      className="rounded-xl"
                      src={m.advertiser.store_logo}
                      alt={m.advertiser.name}
                    />
                  </div>
                  <div className="flex items-center flex-grow justify-between">
                    <div>
                      <p>{m.campaign.creative.title}</p>
                      <p>{m.campaign.creative.text}</p>
                    </div>
                    <div>
                      {offer_ids.includes(m.campaign.offer_id) ? (
                        <Button disabled>
                          <MdOutlineDone size={20} />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setUrl((prev) => {
                              return [
                                ...prev,
                                `https://instalanding.shop/${m.campaign.offer_id}`,
                              ];
                            });
                          }}
                        >
                          select
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="absolute left-12 bottom-2">
          <CarouselPrevious />
        </div>
        <div className="absolute right-12 bottom-2">
          <CarouselNext />
        </div>
        <div className="text-center pt-4">
          <p className="text-[10px] text-[#0000005a]">Unlock Exclusive Rewards with Your Purchase!</p>
        </div>
      </Carousel>
    </div>
  );
};

const SuspenseWrapper: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
};

export default SuspenseWrapper;
