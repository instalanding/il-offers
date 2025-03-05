"use server";
import React from "react";
import Campaigns from "@/components/offers/Campaigns";
import { Metadata, ResolvingMetadata } from "next";
import FontLoader from "@/components/offers/components/FontLoader";
import { MdErrorOutline } from "react-icons/md";
import { formatDate } from "@/lib/formatUtils";
import { headers } from 'next/headers';
import { isValidDomain } from '@/utils/domainUtils';

// Cache time in seconds (10 minutes)
const REVALIDATE_TIME = 600;

const getCampaign = async (slug: string, variant_id?: string) => {
  try {
    const query = new URLSearchParams();
    query.append("slug", slug);
    if (variant_id) {
      query.append("variant", variant_id);
    }

    const response = await fetch(
      `${process.env.API_URL_V2}campaign?${query.toString()}`,
      { 
        next: { revalidate: REVALIDATE_TIME }
      }
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
    return null;
  }
};

const getVariantCollection = async (slug: string, variant_id: string) => {
  try {
    const response = await fetch(
      `${process.env.API_URL_V2}collection?slug=${slug}&variant_id=${variant_id}`, {
      next: { revalidate: REVALIDATE_TIME }
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error fetching collections:", errorResponse);
      throw new Error("Failed to fetch collections");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const getReviews = async (product_handle: string) => {
  try {
    const response = await fetch(`${process.env.API_URL_V2}/reviews?slug=${product_handle}`, {
      next: { revalidate: REVALIDATE_TIME }
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
    return [];
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
  variant_id?: string;
};

const CampaignSlug = async ({ params, searchParams }: { params: { slug: string }; searchParams: SearchParams }) => {
  const { slug } = params;
  const headersList = headers();
  const domain = headersList.get('host') || '';
  const variant_id = searchParams.variant_id;
  const userIp = searchParams.user_ip ?? "";

  const utm_params = Object.fromEntries(
    Object.entries(searchParams).filter(([key]) =>
      key.startsWith('utm_') ||
      ['source', 'medium', 'campaign', 'term', 'content'].includes(key)
    )
  );

  // Add variant_id to utm_params if it exists
  if (variant_id) {
    utm_params.variant = variant_id;
  }

  // Fetch initial campaign data
  const data = await getCampaign(slug, variant_id);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 rounded-md shadow-md">
        <MdErrorOutline className="text-red-600 text-6xl mb-4" />
        <h1 className="font-bold text-red-600 text-lg mb-2">Campaign Not Found</h1>
        <p className="text-gray-600 text-sm text-center">
          The campaign you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
      </div>)
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

  // Parse blocks only once and efficiently
  const blocks = typeof data.blocks === 'string' 
    ? JSON.parse(data.blocks || '[]') 
    : (Array.isArray(data.blocks) ? data.blocks : []);

  // Check for specific block types to determine if we need to fetch additional data
  const hasReviewsBlock = blocks.some((block: any) => block.type === 'reviews');
  const hasVariantsBlock = blocks.some((block: any) => block.type === 'variants');

  // Fetch additional data in parallel if needed
  const [reviews, collections] = await Promise.all([
    hasReviewsBlock ? getReviews(data.product_handle) : Promise.resolve([]),
    hasVariantsBlock ? getVariantCollection(data.product_handle, data.variant_id) : Promise.resolve([])
  ]);

  // Format reviews data only if we have reviews
  const formattedReviews = reviews?.map((review: any) => ({
    userName: review.reviewer_name,
    comment: review.review_body_text,
    rating: review.review_rating,
    date: formatDate(review.review_date)
  })) || [];

  const fontFamily = data?.config?.font_family || "Inter";

  return (
    <>
      <FontLoader fontFamily={fontFamily} />
      <Campaigns
        campaignData={{ 
          ...data, 
          config: { ...data.config, font_family: fontFamily }, 
          reviews: formattedReviews, 
          collections 
        }}
        utm_params={utm_params}
        userIp={userIp}
        preserveParams={true}
      />
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
    icons: data?.advertiser?.store_favicon?.url
      ? [{ rel: "icon", url: data.advertiser.store_favicon.url }]
      : [{ rel: "icon", url: "/favicon.ico" }],
    openGraph: {
      title,
      description,
      url: `https://instalanding.shop/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
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