"use server";
import React from "react";
import Redirect from "./Redirect";
import { new_backend_url } from "@/utils/constants";
import { userAgent } from "next/server";
import { permanentRedirect } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
interface PageProps {
  params: { offer_id: string };
  searchParams: { mode: string; user_ip?: any };
}

const getDeeplink = async (offer_id: string) => {
  try {
    console.log(`${new_backend_url}deeplink/${offer_id}`);

    const response = await fetch(`${new_backend_url}deeplink/${offer_id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch campaign");
    }
    const data = await response.json(); // Process the JSON body
    // console.log(data, "response data"); // Log the actual response data
    return data; // Return the parsed data
  } catch (error) {
    console.log(error);
  }
};

const Page: React.FC<PageProps> = async ({ params, searchParams }) => {
  const { offer_id } = params;


  // data fetched here

  const data = await getDeeplink(offer_id);

  // redirect happens here

  if(!data){
    return <div>Deeplink not found</div>
  }

  return <Redirect data={data} />;

};

export default Page;


export async function generateMetadata(
  { params, searchParams }: { params: { offer_id: string; }; searchParams: any },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { offer_id } = params;
  const data = await getDeeplink(offer_id);

  const title = data?.meta_title || "Instalanding Offers";
  const description = data?.meta_description || "Explore exclusive offers with Instalanding.";
  const imageUrl = data?.meta_description?.image?.url || "/default-meta-image.jpg";

  return {
    title,
    description,
    icons: data?.advertiser?.store_logo?.url
      ? [{ rel: "icon", url: data.advertiser.store_logo.url.toString() }]
      : [],
    // icons: [{ rel: "icon", url: data.advertiser.store_logo || "/favicon.ico" }],
    openGraph: {
      title,
      description,
      url: `https://instalanding.shop/${offer_id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "theme-color": data?.config?.primary_color || "#FFFFFF",
      "twitter:image": imageUrl,
      "twitter:card": "summary_large_image",
      "og:url": `https://instalanding.shop/${offer_id}`,
      "og:image": imageUrl,
      "og:type": "website",
    },
  };
}