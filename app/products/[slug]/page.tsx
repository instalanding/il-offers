import { Metadata } from "next";
import { MdErrorOutline } from "react-icons/md";
import { headers } from 'next/headers';
import { isValidDomain } from '@/utils/domainUtils';
import { formatDateServer } from "@/lib/serverFormatUtils";
import { cache } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { generateFontPreloadLinks } from '@/lib/fontUtils';
import { FONT_FAMILY_MAPPING } from '@/lib/fontUtils';

// Simple loading component
function ProductLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="w-full h-96 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamic import of client Campaigns component
const ClientCampaigns = dynamic(() => import('@/components/offers/Campaigns').catch(err => {
  console.error("Error loading Campaigns component:", err);
  const ErrorComponent = () => <div>Error loading campaign content</div>;
  ErrorComponent.displayName = 'CampaignsErrorFallback';
  return ErrorComponent;
}), {
  ssr: true,
  loading: () => <ProductLoading />
});

// Add performance monitoring component
const ClientPerformanceMonitor = dynamic(() => import('@/components/ClientPerformanceScript'), {
  ssr: false,
  loading: () => null
});

// Load the FontPreloader as a client component
const ClientFontPreloader = dynamic(() => import('@/components/FontPreloader'), {
  ssr: false,
  loading: () => null
});

// Constants
const REVALIDATE_TIME = 3600; // 1 hour cache

// Update the API fetch calls with more robust error handling
const getCachedCampaign = cache(async (slug: string, variant_id?: string) => {
  try {
    // Build query string manually
    let queryString = `slug=${encodeURIComponent(slug)}`;
    if (variant_id) {
      queryString += `&variant_id=${encodeURIComponent(variant_id)}`;
    }

    // Construct the API URL
    const apiUrl = `${process.env.API_URL_V2}/campaign?${queryString}`;
    
    const response = await fetch(apiUrl, { 
      next: { revalidate: REVALIDATE_TIME }
    });

    // Check if the response is OK before parsing JSON
    if (!response.ok) {
      return null;
    }

    // Add extra checks to prevent JSON parsing errors
    const text = await response.text();
    if (!text || text.trim() === '') {
      return null;
    }

    try {
      const data = JSON.parse(text);
      
      // Based on the API response format, we need to check:
      // 1. If data exists and has a data property
      // 2. If data.data is an array
      // 3. If the array is not empty
      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        // For variant_id, find the matching variant
        if (variant_id) {
          const variantMatch = data.data.find((item: any) => item.variant_id === variant_id);
          if (variantMatch) {
            return variantMatch;
          }
        }
        
        // If no variant_id specified or no match found, return the first item
        return data.data[0];
      }
      
      return null;
    } catch (parseError) {
      return null;
    }
  } catch (error) {
    return null;
  }
});

// Metadata generation for this page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    // Fetch campaign data
    const data = await getCachedCampaign(params.slug);
    
    // Extract title and description
    const title = data?.meta_description?.title || data?.campaign_title || "Instalanding";
    const description = data?.meta_description?.description || "Explore exclusive offers with Instalanding.";
    
    // Get font family for preloading
    const fontFamily = data?.config?.font_family;
    
    // Generate font preload links
    const fontLinks = generateFontPreloadLinks(fontFamily || '');
    
    return {
      title,
      description,
      metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://instalanding.shop'),
      ...(fontLinks.length > 0 && { links: fontLinks }),
    };
  } catch (error) {
    return {
      title: "Product Page",
      description: "Product page",
    };
  }
}

// Cache the collection data fetching with robust error handling
const getCachedVariantCollection = cache(async (slug: string, variant_id: string) => {
  try {
    const queryString = `slug=${encodeURIComponent(slug)}&variant_id=${encodeURIComponent(variant_id)}`;
    
    // Construct the API URL
    const apiUrl = `${process.env.API_URL_V2}/collection?${queryString}`;
    
    const response = await fetch(apiUrl, {
      next: { revalidate: REVALIDATE_TIME }
    });
    
    if (!response.ok) {
      return [];
    }
    
    // Add extra checks to prevent JSON parsing errors
    const text = await response.text();
    if (!text || text.trim() === '') {
      return [];
    }

    try {
      const data = JSON.parse(text);
      // Add null check before accessing .data property
      return data && data.data ? data.data : [];
    } catch (parseError) {
      return [];
    }
  } catch (error) {
    return [];
  }
});

// Cache the reviews data fetching with robust error handling
const getCachedReviews = cache(async (product_handle: string) => {
  if (!product_handle) return [];
  
  try {
    const queryString = `slug=${encodeURIComponent(product_handle)}`;
    
    // Construct the API URL
    const apiUrl = `${process.env.API_URL_V2}/reviews?${queryString}`;
    
    const response = await fetch(apiUrl, {
      next: { revalidate: REVALIDATE_TIME }
    });
    
    if (!response.ok) {
      return [];
    }
    
    // Add extra checks to prevent JSON parsing errors
    const text = await response.text();
    if (!text || text.trim() === '') {
      return [];
    }

    try {
      const data = JSON.parse(text);
      
      // Handle different possible response structures
      if (data?.statusCode?.data && Array.isArray(data.statusCode.data)) {
        // Structure: { statusCode: { success: true, data: [...] }, message, success }
        return data.statusCode.data;
      } else if (data?.data && Array.isArray(data.data)) {
        // Structure: { data: [...] }
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

// Type definition for search params
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
  debug?: string;
};

// Helper to extract first image URL safely
const getFirstImageUrl = (campaignData: any): string => {
  if (!campaignData?.images || !Array.isArray(campaignData.images) || campaignData.images.length === 0) {
    return '';
  }
  return campaignData.images[0]?.url || '';
};

// Main component
export default async function ProductPage({ 
  params,
  searchParams 
}: { 
  params: { slug: string };
  searchParams: SearchParams;
}) {
  // Validate environment variables
  const envValid = validateEnvironment();
  if (!envValid) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 rounded-md shadow-md">
        <MdErrorOutline className="text-red-600 text-6xl mb-4" />
        <h1 className="font-bold text-red-600 text-lg mb-2">Configuration Error</h1>
        <p className="text-gray-600 text-sm text-center">
          Missing API configuration. Please check server logs.
        </p>
      </div>
    );
  }

  // Get base data
  const { slug } = params;
  const headersList = headers();
  const domain = headersList.get('host') || '';
  const variant_id = searchParams.variant_id;
  const userIp = searchParams.user_ip ?? "";

  // Extract UTM parameters for tracking
  const utm_params = Object.fromEntries(
    Object.entries(searchParams).filter(([key]) =>
      key.startsWith('utm_') || 
      ['source', 'medium', 'campaign', 'id', 'term', 'content'].includes(key)
    )
  );

  // Fetch the campaign data with error handling
  let campaignData = null;
  try {
    campaignData = await getCachedCampaign(slug, variant_id);
  } catch (error) {
    // Show error UI
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 rounded-md shadow-md">
        <MdErrorOutline className="text-red-600 text-6xl mb-4" />
        <h1 className="font-bold text-red-600 text-lg mb-2">API Error</h1>
        <p className="text-gray-600 text-sm text-center">
          There was an error fetching the campaign data. Please try again later.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 bg-gray-100 p-4 rounded text-xs overflow-auto max-w-lg">
            {String(error)}
          </pre>
        )}
      </div>
    );
  }
  
  // Error handling for missing campaign
  if (!campaignData) {
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

  // Check domain validation if needed
  if (process.env.CHECK_DOMAIN_VALIDATION === 'true') {
    const isAllowedDomain = isValidDomain(domain, campaignData.advertiser?.domains || []);
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
  }

  // Parse blocks and check what additional data we need
  let blocks = [];
  try {
    blocks = JSON.parse(campaignData?.blocks || '[]');
  } catch (error) {
    blocks = [];
  }

  const hasReviewsBlock = blocks.some((block: any) => block.type === 'reviews');
  const hasVariantsBlock = blocks.some((block: any) => block.type === 'variants');
  
  // Fetch additional data in parallel
  const [reviews, collections] = await Promise.all([
    hasReviewsBlock ? getCachedReviews(campaignData.product_handle) : Promise.resolve([]),
    hasVariantsBlock ? getCachedVariantCollection(slug, campaignData.variant_id) : Promise.resolve([])
  ]);

  // Format reviews data if we have it
  const formattedReviews = Array.isArray(reviews) ? reviews.map((review: any) => ({
    userName: review.reviewer_name,
    comment: review.review_body_text,
    rating: review.review_rating,
    date: formatDateServer(review.review_date)
  })) : [];

  // Get font family and prepare data for client component
  const fontFamily = campaignData?.config?.font_family || "Inter";
  
  // Get first image for preloading
  const firstImage = getFirstImageUrl(campaignData);

  // Return the complete page
  return (
    <>
      {/* Preload LCP image if available */}
      {firstImage && (
        <link
          rel="preload"
          href={firstImage}
          as="image" 
          fetchPriority="high"
        />
      )}
      
      {/* Render the client component with all the data */}
      <ClientCampaigns
        campaignData={{
          ...campaignData,
          config: { ...campaignData.config, font_family: fontFamily },
          reviews: formattedReviews,
          collections
        }}
        utm_params={utm_params}
        userIp={userIp}
        preserveParams={true}
      />
      
      {/* Add performance monitoring in development or with query param */}
      {(process.env.NODE_ENV === 'development' || searchParams.debug === 'true') && (
        <ClientPerformanceMonitor />
      )}
      
      {/* Add font preloading to HTML head - client component handles this better */}
      <ClientFontPreloader fontFamily={fontFamily} />
    </>
  );
}

// Enhance environment validation to ensure correct API path
function validateEnvironment() {
  if (!process.env.API_URL_V2) {
    console.error("API_URL_V2 is not defined in environment variables");
    return false;
  }
  
  if (!process.env.API_URL_V2.includes('/v2/api')) {
    process.env.API_URL_V2 = `${process.env.API_URL_V2}/v2/api`;
  }
  
  return true;
}