import React from "react";
import dynamic from "next/dynamic";
import { MdErrorOutline } from "react-icons/md";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from 'react';


export const runtime = "edge";

// Client-side components with error handling
const Collections = dynamic(() => import("@/components/offers/Collections").catch(err => {
  console.error("Error loading Collections component:", err);
  const ErrorComponent = () => <div className="p-6 text-center">Error loading collections content</div>;
  ErrorComponent.displayName = 'CollectionsErrorFallback';
  return ErrorComponent;
}), {
  ssr: true,
  loading: () => <CollectionsLoading />
});

const ClientFontPreloader = dynamic(() => import("@/components/offers/components/FontLoader"), {
  ssr: false,
  loading: () => null
});

const ClientPerformanceMonitor = dynamic(() => import('@/components/ClientPerformanceScript'), {
  ssr: false,
  loading: () => null
});

function CollectionsLoading() {
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

function validateEnvironment() {
  if (!process.env.API_URL_V2) {
    return false;
  }
  
  // Remove trailing slashes for URL normalization
  if (process.env.API_URL_V2.endsWith('/')) {
    process.env.API_URL_V2 = process.env.API_URL_V2.slice(0, -1);
  }
  
  // Ensure API path includes required version segment
  if (!process.env.API_URL_V2.includes('/v2/api')) {
    process.env.API_URL_V2 = `${process.env.API_URL_V2}/v2/api`;
  }
  
  return true;
}

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

const getFirstImageUrl = (collectionsData: any): string => {
  if (!collectionsData?.meta_description?.image?.url) {
    return '/default-meta-image.jpg';
  }
  return collectionsData.meta_description.image.url;
};

const generateFontPreloadLinks = (fontFamily: string) => {
  if (!fontFamily || !FONT_FAMILY_MAPPING[fontFamily]) return [];
  
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
      href: `https://fonts.googleapis.com/css2?family=${FONT_FAMILY_MAPPING[fontFamily]}&display=swap`
    }
  ];
};

const FONT_FAMILY_MAPPING: Record<string, string> = {
  // Sans-serif
  'Inter': 'Inter:wght@400;500;600;700',
  'Poppins': 'Poppins:wght@400;500;600;700',
  'Roboto': 'Roboto:wght@400;500;700',
  'Open Sans': 'Open+Sans:wght@400;500;600;700',
  'Lato': 'Lato:wght@400;700',
  'Montserrat': 'Montserrat:wght@400;500;600;700',
  'Nunito': 'Nunito:wght@400;500;600;700',
  'Nunito Sans': 'Nunito+Sans:wght@400;600;700',
  'Raleway': 'Raleway:wght@400;500;600;700',
  'Work Sans': 'Work+Sans:wght@400;500;600;700',
  
  // Serif
  'Playfair Display': 'Playfair+Display:wght@400;500;600;700',
  'Merriweather': 'Merriweather:wght@400;700',
  'Lora': 'Lora:wght@400;500;600;700',
  'Cormorant': 'Cormorant:wght@400;500;600;700',
  'EB Garamond': 'EB+Garamond:wght@400;500;600;700',
  
  // Display
  'Oswald': 'Oswald:wght@400;500;600;700',
  'Bebas Neue': 'Bebas+Neue',
  'DM Sans': 'DM+Sans:wght@400;500;700',
  'Quicksand': 'Quicksand:wght@400;500;600;700',
  'Comfortaa': 'Comfortaa:wght@400;500;600;700',
  
  // Monospace
  'Fira Code': 'Fira+Code:wght@400;500;700',
  'Space Mono': 'Space+Mono:wght@400;700',
  
  // Non-Latin Support
  'Noto Sans': 'Noto+Sans:wght@400;500;700',
  'IBM Plex Sans': 'IBM+Plex+Sans:wght@400;500;600',
  
  // Versatile Variable Fonts
  'Epilogue': 'Epilogue:wght@100..900',
  'Outfit': 'Outfit:wght@100..900',
  
  // Industry-Specific
  'Rubik': 'Rubik:wght@400;500;700',
  'Barlow': 'Barlow:wght@400;500;600;700',
  'Karla': 'Karla:wght@400;500;700',
  
  // Accessibility-Focused
  'Atkinson Hyperlegible': 'Atkinson+Hyperlegible:wght@400;700'
};

const getCollections = cache(async (slug: string, variant_id?: string) => {
    "use server";
    if (!validateEnvironment()) {
        return null;
    }

    try {
        const query = new URLSearchParams({ slug });
        if (variant_id) {
            query.append("variant", variant_id);
        }

        const response = await fetch(
            `${process.env.API_URL_V2}/collection?${query.toString()}`, {
            next: { revalidate: 3600 }, // 1 hour cache with revalidation
        });
        
        if (!response.ok) {
            console.error("Error fetching collections:", response.status, response.statusText);
            return null;
        }
        
        const text = await response.text();
        if (!text || text.trim() === '') {
            return null;
        }
        
        try {
            const data = JSON.parse(text);
            
            // Handle multiple potential response structures
            if (data?.data) {
                return data.data;
            } else if (data?.statusCode?.data) {
                return data.statusCode.data;
            } else {
                return data;
            }
        } catch (parseError) {
            console.error("Error parsing collections JSON:", parseError);
            return null;
        }
    } catch (error) {
        console.error("Error in collections fetch:", error);
        return null;
    }
});

const Collection = async ({
    params,
    searchParams
}: {
    params: { slug: string; variant_id?: string };
    searchParams: SearchParams;
}) => {
    const { slug, variant_id } = params;
    const collections = await getCollections(slug, variant_id);

    if (!collections) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 rounded-md shadow-md">
                <MdErrorOutline className="text-red-600 text-6xl mb-4" />
                <h1 className="font-bold text-red-600 text-lg mb-2">Collections Not Found</h1>
                <p className="text-gray-600 text-sm text-center">
                    The collections you&apos;re looking for don&apos;t exist or may have been removed.
                </p>
            </div>
        );
    }
    
    const fontFamily = collections?.config?.font_family || "Inter";
    const firstImage = getFirstImageUrl(collections);

    return (
        <>
            {firstImage && (
                <link
                    rel="preload"
                    href={firstImage}
                    as="image" 
                    fetchPriority="high"
                />
            )}
            <ClientFontPreloader fontFamily={fontFamily} />
            <Collections data={collections} />
            {(process.env.NODE_ENV === 'development' || searchParams?.debug === 'true') && (
                <ClientPerformanceMonitor />
            )}
        </>
    );
};

export default Collection;

export async function generateMetadata(
    { params, searchParams }: { params: { slug: string; variant_id?: string }; searchParams: SearchParams },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug, variant_id } = params;
    const data = await getCollections(slug, variant_id);
    
    if (!data) {
        return {
            title: "Collections Not Found - Instalanding",
            description: "The collections you're looking for don't exist or may have been removed."
        };
    }

    const title = data?.meta_description?.title || "Instalanding Offers";
    const description = data?.meta_description?.description || "Explore exclusive offers with Instalanding.";
    const imageUrl = data?.meta_description?.image?.url || "/default-meta-image.jpg";
    const fontFamily = data?.config?.font_family || "Inter";
    const fontLinks = generateFontPreloadLinks(fontFamily);

    return {
        title,
        description,
        icons: data?.advertiser?.store_favicon?.url
            ? [{ rel: "icon", url: data.advertiser.store_favicon.url.toString() }]
            : [],
        ...(fontLinks.length > 0 && { links: fontLinks }),
        openGraph: {
            title,
            description,
            url: `https://instalanding.shop/collections/${slug}`,
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
            "og:url": `https://instalanding.shop/collections/${slug}`,
            "og:image": imageUrl,
            "og:type": "website",
        },
    };
}