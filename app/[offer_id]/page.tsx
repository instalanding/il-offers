"use server";
import React from "react";
import Campaigns from "@/components/offers/Campaigns";
import { Metadata, ResolvingMetadata } from "next";
import FontLoader from "@/components/offers/components/FontLoader";
import { MdErrorOutline } from "react-icons/md";
import { formatDate } from "@/lib/formatUtils";
import { headers } from 'next/headers';
import { isValidDomain } from '@/utils/domainUtils';

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

const getVariantCollection = async (slug: string, variant_id: string) => {
  try {
    const response = await fetch(
      `${process.env.API_URL_V2}collection?slug=${slug}&variant_id=${variant_id}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error fetching collections:", errorResponse);
      throw new Error("Failed to fetch collections");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log(error)
  }
}

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

type SearchParams = {
  os?: string;
  cpu?: string;
  isBot?: string;
  ua?: string;
  browser?: string;
  device?: string;
  engine?: string;
  user_ip?: string;
};

const Campaign = async ({ params, searchParams }: { params: { offer_id?: string }; searchParams: SearchParams; }) => {
  const headersList = headers();
  const domain = headersList.get('host') || '';

  const data = await getCampaign({ offer_id: params.offer_id });

  // Return not found if no campaign data
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 rounded-md shadow-md">
        <MdErrorOutline className="text-red-600 text-6xl mb-4" />
        <h1 className="font-bold text-red-600 text-lg mb-2">Campaign Not Found</h1>
        <p className="text-gray-600 text-sm text-center">
          The campaign you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
      </div>
    );
  }

  // Check if current domain is allowed
  const isAllowedDomain = isValidDomain(domain, data.advertiser?.domains || []);
  if (!isAllowedDomain) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 rounded-md shadow-md">
        <MdErrorOutline className="text-red-600 text-6xl mb-4" />
        <h1 className="font-bold text-red-600 text-lg mb-2">Access Denied</h1>
        <p className="text-gray-600 text-sm text-center">
          This campaign is not available on this domain.
        </p>
      </div>
    );
  }

  const userIp = searchParams.user_ip ?? "";

  const utm_params = Object.fromEntries(
    Object.entries(searchParams).filter(([key]) =>
      key.startsWith('utm_') ||
      ['source', 'medium', 'campaign', 'id', 'term', 'content'].includes(key)
    )
  );

  const blocks = JSON.parse(data?.blocks || '[]');
  const hasReviewsBlock = blocks.some((block: any) => block.type === 'reviews');
  const apiReviews = hasReviewsBlock && data ? await getReviews(data.product_handle) : [];
  const hasVariantsBlock = blocks.some((block: any) => block.type === 'variants');
  const collections = hasVariantsBlock && data.product_handle ? await getVariantCollection(data.product_handle, data.variant_id) : [];

  const reviews = apiReviews?.map((review: any) => ({
    userName: review.reviewer_name,
    comment: review.review_body_text,
    rating: review.review_rating,
    date: formatDate(review.review_date)
  }));

  const fontFamily = data?.config?.font_family || "Inter";

  return (
    <>
      <FontLoader fontFamily={fontFamily} />
      <Campaigns
        campaignData={{ ...data, config: { ...data.config, font_family: fontFamily }, reviews, collections }}
        utm_params={utm_params}
        userIp={userIp}
        preserveParams={true}
      />
    </>
  );
};

export default Campaign;

export async function generateMetadata(
  { params, searchParams }: { params: { offer_id: string; }; searchParams: any },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { offer_id } = params;
  const data = await getCampaign({ offer_id });

  const title = data?.meta_description?.title || "Instalanding Offers";
  const description = data?.meta_description?.description || "Explore exclusive offers with Instalanding.";
  const imageUrl = data?.meta_description?.image?.url || "/default-meta-image.jpg";

  return {
    title,
    description,
    icons: data?.advertiser?.store_favicon?.url
      ? [{ rel: "icon", url: data.advertiser.store_favicon.url.toString() }]
      : [],
    // icons: [{ rel: "icon", url: data.advertiser.store_favicon || "/favicon.ico" }],
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