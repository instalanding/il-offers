"use server";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import V2 from "@/components/v2/v2";
import FontLoader from "@/components/v2/FontLoader";

const getCampaign = async (params: { offer_id?: string }) => {
  try {
    const { offer_id } = params;
    const query = new URLSearchParams();

    if (offer_id) query.append("offer_id", offer_id);

    const response = await fetch(
      `${process.env.API_URL_V2}campaign?${query.toString()}`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error fetching campaign:", errorResponse);
      throw new Error("Failed to fetch campaign");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

const Campaign = async ({
  params
}: {
  params: { offer_id?: string };
}) => {
  const { offer_id } = params;

  const data = await getCampaign({ offer_id });

  if (!data) {
    return <h1 className="font-semibold text-red-600">Campaign not found!</h1>;
  }

  const fontFamily = data.config.font_family;
  return (
    <>
      <FontLoader fontFamily={fontFamily} />
      <V2 campaignData={{ ...data, config: { ...data.config, font_family: fontFamily } }} />
    </>
  );
};

export default Campaign;

export async function generateMetadata(
  { params, searchParams }: { params: { offer_id?: string; slug?: string; variant_id?: string }; searchParams: any },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { offer_id, slug, variant_id } = params;
  const data = await getCampaign({ offer_id });

  const title = data?.meta_description?.title || "Instalanding Offers";
  const description = data?.meta_description?.description || "Explore exclusive offers with Instalanding.";
  const imageUrl = data?.meta_description?.image?.url || "/default-meta-image.jpg";

  return {
    title,
    description,
    icons: [{ rel: "icon", url: data?.advertiser?.store_logo || "/favicon.ico" }],
    openGraph: {
      title,
      description,
      url: `https://instalanding.shop/${offer_id || slug}`,
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
      "theme-color": data?.config?.primary_color || "#ffffff",
    },
  };
}