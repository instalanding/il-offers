"use server";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import V2 from "@/components/v2/v2";
import FontLoader from "@/components/v2/FontLoader";
import { MdErrorOutline } from "react-icons/md";
import { formatDate } from "@/lib/formatUtils";

const getCampaign = async (params: { offer_id?: string }) => {
  try {
    const { offer_id } = params;
    const query = new URLSearchParams();

    if (offer_id) query.append("offer_id", offer_id);

    const response = await fetch(
      `${process.env.API_URL_V2}campaign?${query.toString()}`,
      { cache: "no-store" }
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

const getReviews = async (product_handle: string) => {
  try {
    const response = await fetch(`${process.env.API_URL_V2}/reviews?slug=${product_handle}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error fetching reviews:", errorResponse);
      throw new Error("Failed to fetch reviews");
    }
    const data = await response.json();
    return data.statusCode.data;
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
  const apiReviews = data ? await getReviews(data.product_handle) : [];

  const reviews = apiReviews?.map((review: any) => ({
    userName: review.reviewer_name,
    comment: review.review_body_text,
    rating: review.review_rating,
    date: formatDate(review.review_date)
  }));

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 rounded-md shadow-md">
        <MdErrorOutline className="text-red-600 text-6xl mb-4" />
        <h1 className="font-bold text-red-600 text-lg mb-2">Campaign Not Found</h1>
        <p className="text-gray-600 text-sm text-center">
          The campaign you’re looking for doesn’t exist or may have been removed.
        </p>
      </div>
    );
  }

  const fontFamily = data?.config?.font_family || "Inter";

  return (
    <>
      <FontLoader fontFamily={fontFamily} />
      <V2 campaignData={{ ...data, config: { ...data.config, font_family: fontFamily }, reviews }} />
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