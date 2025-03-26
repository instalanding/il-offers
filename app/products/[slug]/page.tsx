import { formatDateServer } from "@/lib/serverFormatUtils";
import { CampaignWithParams } from "./client-components";
import { Metadata, ResolvingMetadata } from "next/types";
import { cache } from 'react';

type Params = {
  slug: string;
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
  variant?: string;
  debug?: string;
};

// Shared fetch function to avoid code duplication
async function getCampaignData(slug: string) {
  const response = await fetch(
    `${process.env.API_URL_V2}/campaign?slug=${slug}`
  );
  const data = await response.json();
  return data.data;
}

async function getReviewsData(product_handle: string) {
  const response = await fetch(
    `${process.env.API_URL_V2}/reviews?slug=${product_handle}`
  );
  const data = await response.json();

  const reviews = Array.isArray(data.statusCode.data)
    ? data.statusCode.data.map((review: any) => ({
      userName: review.reviewer_name,
      comment: review.review_body_text,
      rating: review.review_rating,
      date: formatDateServer(review.review_date),
    }))
    : [];

  return reviews;
}

const getCachedCollectionById = cache(async (collection_id: string) => {
  try {
    if (!collection_id || !process.env.API_URL_V2) {
      return null;
    }

    const response = await fetch(
      `${process.env.API_URL_V2}/collection/${collection_id}`,
      {
        next: { revalidate: 10 }
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

const page = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const campaign = await getCampaignData(params.slug);
  const reviews = await getReviewsData(params.slug);

  // Add blocks parsing and collection fetching
  let blocks = [];
  try {
    blocks = JSON.parse(campaign[0]?.blocks || '[]');
  } catch (error) {
    blocks = [];
  }

  const collectionBlock = blocks.find((block: any) => block.type === 'collections');
  const collection_id = collectionBlock?.value?.collection_id || '2b2ce';

  const collectionById = await getCachedCollectionById(collection_id);

  return (
    <div>
      <CampaignWithParams
        campaignData={campaign}
        reviews={reviews}
        userIp={searchParams.user_ip || ""}
        collectionById={collectionById}
      />
    </div>
  );
};

export default page;

// Change from static to dynamic rendering to access search params
export const dynamic = "force-static";

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

  const allData = await getCampaignData(slug);

  const data = allData[0];

  const title = data?.meta_description?.title || "Instalanding Offers";
  const description =
    data?.meta_description?.description ||
    "Explore exclusive offers with Instalanding.";
  const imageUrl =
    data?.meta_description?.image?.url || "/default-meta-image.jpg";

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
