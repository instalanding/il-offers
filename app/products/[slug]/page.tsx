import { CampaignWithParams } from "./client-components";
import { Metadata, ResolvingMetadata } from "next/types";

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


const page = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {

  const campaign = await getCampaignData(params.slug);

  return (
    <div>
      <CampaignWithParams
        campaignData={campaign}
        userIp={searchParams.user_ip || ""}
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

  const data = allData[0]

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