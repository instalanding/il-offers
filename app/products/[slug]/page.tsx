"use server";
import React from "react";
import V2 from "@/components/v2/v2";
import { Metadata, ResolvingMetadata } from "next";
import FontLoader from "@/components/v2/FontLoader";

const getCampaign = async (slug: string, variant_id?: string) => {
  try {
    const query = new URLSearchParams();
    query.append("slug", slug);
    if (variant_id) {
      query.append("variant_id", variant_id);
    }

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
    const campaignData = Array.isArray(data.data) ? data.data[0] : data.data;
    return campaignData;
  } catch (error) {
    console.log(error);
  }
};

const CampaignSlug = async ({ params, searchParams }: { params: { slug: string }; searchParams: { variant_id?: string } }) => {
  const { slug } = params;
  const variant_id = searchParams.variant_id;
  const data = await getCampaign(slug, variant_id);
  const fontFamily = data.config.font_family;

  if (!data) {
    return <h1 className="font-semibold text-red-600">Campaign not found!</h1>;
  }

  return (
    <>
      <FontLoader fontFamily={fontFamily} />
      <V2 campaignData={data} />
    </>
  );
};

export default CampaignSlug;

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams: { variant?: string };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const variantId = searchParams.variant;

  const data = await getCampaign(slug, variantId);

  const title = data?.meta_description?.title || "Instalanding Offers";
  const description = data?.meta_description?.description || "Explore exclusive offers with Instalanding.";
  const imageUrl = data?.meta_description?.image?.url || "/default-meta-image.jpg";


  return {
    title: title,
    description: description,
    icons: [{ rel: "icon", url: data?.advertiser?.store_logo || "/favicon.ico" }],
    openGraph: {
      images: [
        {
          url: imageUrl,
          width: 200,
          height: 200,
        },
      ],
    },
    other: {
      "theme-color": data?.config?.primary_color || "#FFFFFF",
      "twitter:image": imageUrl,
      "twitter:card": "summary_large_image",
      "og:url": `https://instalanding.shop/${slug}`,
      "og:image": imageUrl,
      "og:type": "website",
    },
  };
}