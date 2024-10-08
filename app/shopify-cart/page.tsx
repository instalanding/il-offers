"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import CarouselWrapper from "./CarouselWrapper";
import { url } from "inspector";

interface PageProps {}

const Page: React.FC<PageProps> = () => {
  const [urls, setUrls] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();

  const instalandingAppId = searchParams.get("instalanding_app_id");
  const userIp = searchParams.get("user_ip");
  const ad_url = searchParams.get("ad_url") || "";

  useEffect(() => {
    // Indicate that the component is mounted
    setIsMounted(true);

    if (typeof window !== "undefined") {
      // This code runs only in the browser
      const storedUrls = JSON.parse(
        localStorage.getItem("instalanding_ad_url") || "[]"
      );
      setUrls(storedUrls);
    }
  }, []);

  if (!instalandingAppId || !userIp) {
    return null; // Using null instead of empty fragment for clarity
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <CarouselWrapper
        urls={[...urls, ad_url]}
        instalandingAppId={instalandingAppId}
        userIp={userIp}
      />
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
