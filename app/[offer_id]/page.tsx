import React from "react";
import dynamic from "next/dynamic";
import { Metadata, ResolvingMetadata } from "next";
import { MdErrorOutline } from "react-icons/md";
import { formatDateServer } from "@/lib/serverFormatUtils";
import { headers } from 'next/headers';
import { isValidDomain } from '@/utils/domainUtils';
import { cache } from 'react';


export const runtime = "edge";

// Client-side components with error handling
const ClientCampaigns = dynamic(() => import("../../components/offers/Campaigns").catch(err => {
  console.error("Error loading Campaigns component:", err);
  const ErrorComponent = () => <div className="p-6 text-center">Error loading campaign content</div>;
  ErrorComponent.displayName = 'CampaignsErrorFallback';
  return ErrorComponent;
}), {
  ssr: true,
  loading: () => <CampaignLoading />
});

const ClientFontPreloader = dynamic(() => import("@/components/offers/components/FontLoader"), {
  ssr: false,
  loading: () => null
});

const ClientPerformanceMonitor = dynamic(() => import('@/components/ClientPerformanceScript'), {
  ssr: false,
  loading: () => null
});

function CampaignLoading() {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse p-4 max-w-screen-lg w-full">
        <div className="bg-gray-200 rounded-lg h-64 w-full mb-4"></div>
        <div className="bg-gray-200 rounded-lg h-10 w-1/3 mb-2"></div>
        <div className="bg-gray-200 rounded-lg h-8 w-2/3 mb-4"></div>
        <div className="bg-gray-200 rounded-lg h-32 w-full"></div>
      </div>
    </div>
  );
}

// Helper function to get the first image for LCP optimization
const getFirstImageUrl = (campaignData: any): string => {
  if (!campaignData?.images || !Array.isArray(campaignData.images) || campaignData.images.length === 0) {
    return '';
  }
  return campaignData.images[0]?.url || '';
};

// Function to generate font preload links
const generateFontPreloadLinks = (fontFamily: string) => {
  const FONT_FAMILY_MAPPING: Record<string, string> = {
    'Inter': 'Inter:wght@400;500;600;700',
    'Montserrat': 'Montserrat:wght@400;500;600;700',
    'Open Sans': 'Open+Sans:wght@400;500;600;700',
    'Roboto': 'Roboto:wght@400;500;700',
    'Poppins': 'Poppins:wght@400;500;600;700',
    'Lato': 'Lato:wght@400;700',
    'Oswald': 'Oswald:wght@400;500;600;700',
  };

  const fontString = FONT_FAMILY_MAPPING[fontFamily] || FONT_FAMILY_MAPPING['Inter'];
  if (!fontString) return [];

  return [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
      crossOrigin: 'anonymous'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous'
    },
    {
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=${fontString}&display=swap`
    }
  ];
};

// Environment validation
function validateEnvironment() {
  if (!process.env.API_URL_V2) {
    return false;
  }

  // Remove trailing slashes for URL normalization
  if (process.env.API_URL_V2.endsWith('/')) {
    process.env.API_URL_V2 = process.env.API_URL_V2.slice(0, -1);
  }

  return true;
}

// Enhanced type definitions
type SearchParams = {
  os?: string;
  cpu?: string;
  isBot?: string;
  ua?: string;
  browser?: string;
  device?: string;
  engine?: string;
  user_ip?: string;
  debug?: string;
};

// Cache-enhanced API fetching functions with "use server" directive applied only to server functions
const getCachedCampaign = cache(async (params: { offer_id?: string }) => {
  "use server";
  try {
    if (!validateEnvironment()) {
      return null;
    }

    const { offer_id } = params;
    const query = new URLSearchParams();

    if (offer_id) query.append("offer_id", offer_id);

    const response = await fetch(
      `${process.env.API_URL_V2}/campaign?${query.toString()}`,
      {
        next: { revalidate: 10 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      return null;
    }

    try {
      const data = JSON.parse(text);
      return data.data;
    } catch (parseError) {
      return null;
    }
  } catch (error) {
    return null;
  }
});

const getCachedVariantCollection = cache(async (slug: string, variant_id: string) => {
  "use server";
  try {
    if (!validateEnvironment() || !slug || !variant_id) {
      return null;
    }

    const response = await fetch(
      `${process.env.API_URL_V2}/collection?slug=${slug}&variant_id=${variant_id}`, {
      next: { revalidate: 10 } // Cache for 1 hour
    });

    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      return null;
    }

    try {
      const data = JSON.parse(text);
      return data.data;
    } catch (parseError) {
      return null;
    }
  } catch (error) {
    return null;
  }
});

const getCachedReviews = cache(async (product_handle: string) => {
  "use server";
  try {
    if (!validateEnvironment() || !product_handle) {
      return [];
    }

    const response = await fetch(
      `${process.env.API_URL_V2}/reviews?slug=${product_handle}`, {
      next: { revalidate: 10 } // Cache for 1 hour
    });

    if (!response.ok) {
      return [];
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      return [];
    }

    try {
      const data = JSON.parse(text);

      // Handle multiple potential response structures
      if (data?.statusCode?.data && Array.isArray(data.statusCode.data)) {
        return data.statusCode.data;
      } else if (data?.data && Array.isArray(data.data)) {
        return data.data;
      } else {
        return [];
      }
    } catch (parseError) {
      return [];
    }
  } catch (error) {
    return [];
  }
});

const Campaign = async ({ params, searchParams }: { params: { offer_id?: string }; searchParams: SearchParams; }) => {
  const headersList = headers();
  const domain = headersList.get('host') || '';

  // Fetch campaign data
  const data = await getCachedCampaign({ offer_id: params.offer_id });

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

  // Parse blocks safely
  let blocks = [];
  try {
    blocks = JSON.parse(data?.blocks || '[]');
  } catch (error) {
    blocks = [];
  }

  const hasReviewsBlock = blocks.some((block: any) => block.type === 'reviews');
  const hasVariantsBlock = blocks.some((block: any) => block.type === 'variants');

  // Fetch additional data in parallel only if needed
  const [apiReviews, collections] = await Promise.all([
    hasReviewsBlock && data?.product_handle ? getCachedReviews(data.product_handle) : Promise.resolve([]),
    hasVariantsBlock && data?.product_handle ? getCachedVariantCollection(data.product_handle, data.variant_id) : Promise.resolve([])
  ]);

  // Process review data safely
  const reviews = Array.isArray(apiReviews)
    ? apiReviews.map((review: any) => ({
      userName: review.reviewer_name,
      comment: review.review_body_text,
      rating: review.review_rating,
      date: formatDateServer(review.review_date)
    }))
    : [];

  const fontFamily = data?.config?.font_family || "Inter";
  const firstImage = getFirstImageUrl(data);

  return (
    <>
      {/* Preload critical resources */}
      {firstImage && (
        <link
          rel="preload"
          href={firstImage}
          as="image"
          fetchPriority="high"
        />
      )}

      <ClientFontPreloader fontFamily={fontFamily} />

      <ClientCampaigns
        campaignData={{ ...data, config: { ...data.config, font_family: fontFamily }, reviews, collections }}
        utm_params={utm_params}
        userIp={userIp}
        preserveParams={true}
      />

      {(process.env.NODE_ENV === 'development' || searchParams.debug === 'true') && (
        <ClientPerformanceMonitor />
      )}
    </>
  );
};

export default Campaign;

export async function generateMetadata(
  { params, searchParams }: { params: { offer_id: string; }; searchParams: any },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { offer_id } = params;
  const data = await getCachedCampaign({ offer_id });

  if (!data) {
    return {
      title: "Campaign Not Found | Instalanding",
      description: "The campaign you're looking for doesn't exist or may have been removed."
    };
  }

  const title = data?.meta_description?.title || "Instalanding Offers";
  const description = data?.meta_description?.description || "Explore exclusive offers with Instalanding.";
  const imageUrl = data?.meta_description?.image?.url || "/default-meta-image.jpg";
  const fontFamily = data?.config?.font_family || "Inter";

  // Generate font preload links
  const fontLinks = generateFontPreloadLinks(fontFamily);

  return {
    title,
    description,
    icons: data?.advertiser?.store_favicon?.url
      ? [{ rel: "icon", url: data.advertiser.store_favicon.url.toString() }]
      : [],
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
    ...(fontLinks.length > 0 && { links: fontLinks }),
  };
}