import MultipleCTA from "@/components/landingPage/MultipleCTA";
import NotFound from "@/components/landingPage/NotFound";
import NewLandingPage from "@/components/newLandingPage/NewLandingPage";
import RecordImpressions from "@/components/recordImpressions/page";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";

const getCampaign = async (slug: string, variant?: string) => {
  try {
    // Skip fetch if no variant_id is provided
    if (!variant) {
      console.log("No variant_id provided. Skipping fetch.");
      return null; // Early return avoids further execution
    }

    // Construct URL safely
    const url = new URL(`${process.env.API_URL}/variancecampaigns`);
    url.searchParams.append("slug", slug);
    url.searchParams.append("variant_id", variant);

    console.log("Requesting URL:", url.toString());

    // Fetch the campaign data
    const response = await fetch(url.toString(), { cache: "no-store" });

    // Check for response errors
    if (!response.ok) {
      throw new Error("Failed to fetch campaign");
    }

    const data = await response.json();


    return data;
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return null; // Return null to handle gracefully in UI
  }
};


interface CampaignProps {
  params: { slug: string };
  searchParams: {
    mode: string; 
    user_ip?: any;
    variant?: string;
  };
}

const Campaign = async ({ params, searchParams }: CampaignProps) => {
  const slug = params.slug;
  const variantId = searchParams.variant;
  const userIp = searchParams.user_ip ?? "";
  const headersList = headers();
  const domain = headersList.get("host");

  if (!slug) {
    return (
      <h1 className="font-semibold text-red-600">Product handle is missing!</h1>
    );
  }

  const data = await getCampaign(slug, variantId);
  if (!data) return <NotFound />;

  const domainUrls = Array.isArray(data.domains) ? data.domains : [];

  const isAllowedDomain =
    domainUrls.includes(domain) || domain === "localhost:3200";

  console.log("_____dimains", domainUrls);

  if (!isAllowedDomain) {
    console.log("Domain not allowed:", domain);
    return <NotFound />;
  }

  if (data.templateType && data.templateType === "new-landing") {
    return (
      <>
        {data.pixel && (
          <>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${data.pixel.id}&ev=PageView&noscript=1`}
              alt="Facebook Pixel"
            />
            {data.variant_id && (
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${
                  data.pixel.id
                }&ev=ViewContent&noscript=1&cd[content_name]=${
                  data.creative.title || "Offer"
                }&cd[content_category]=Offer&cd[content_ids]=${
                  data.variant_id || "none"
                }&cd[content_type]=${data.product_handle || "none"}&cd[value]=${
                  data.price.offerPrice.value || 0
                }&cd[currency]=INR`}
                alt="Facebook Pixel ViewContent"
              />
            )}
          </>
        )}
        <RecordImpressions
          offer_id={data.offer_id}
          advertiser={data.advertiser}
          user_ip={userIp}
          store_url={data.store_url}
          tags={data?.tags}
          campaign_id={data._id}
        />
        <NewLandingPage
          schema={data}
          logo={data.store_logo}
          offer_id={slug}
          advertiser={data.advertiser}
          user_ip={userIp}
          store_url={data.store_url}
          tags={data?.tags}
          showDefault={data.showVarientHtml}
        />
      </>
    );
  }

  if (data.templateType && data.templateType === "multiple-cta") {
    return (
      <>
        {data.pixel && (
          <>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${data.pixel.id}&ev=PageView&noscript=1`}
              alt="Facebook Pixel"
            />
            {data.variant_id && (
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${
                  data.pixel.id
                }&ev=ViewContent&noscript=1&cd[content_name]=${
                  data.creative.title || "Offer"
                }&cd[content_category]=Offer&cd[content_ids]=${
                  data.variant_id || "none"
                }&cd[content_type]=${data.product_handle || "none"}&cd[value]=${
                  data.price.offerPrice.value || 0
                }&cd[currency]=INR`}
                alt="Facebook Pixel ViewContent"
              />
            )}
          </>
        )}
        <RecordImpressions
          offer_id={data.offer_id}
          advertiser={data.advertiser}
          user_ip={userIp}
          store_url={data.store_url}
          tags={data?.tags}
          campaign_id={data._id}
        />
        <MultipleCTA
          pixel={data.pixel ? data.pixel.id : ""}
          schema={data}
          logo={data.store_logo}
          offer_id={slug}
          userIp={userIp}
        />
      </>
    );
  }
};

export default Campaign;
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

  const title = data?.creative?.title || "Instalanding offers";
  const description = data?.store_description || "Instalanding Offering";

  // Validate image URL
  const imageUrl =
    data?.templateType === "multiple-cta" || data?.templateType === "new-landing"
      ? data?.creative?.carousel_images?.[0] || ""
      : data?.creative?.image || "";

  return {
    title: title,
    description: description,
    // Validate icons before usage
    icons: data?.store_logo
      ? [{ rel: "icon", url: data.store_logo.toString() }]
      : [],
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
      "theme-color": data?.config?.button1Color || "#FFFFFF",
      "twitter:image": imageUrl,
      "twitter:card": "summary_large_image",
      "og:url": `https://instalanding.shop/${slug}`,
      "og:image": imageUrl,
      "og:type": "website",
    },
  };
}
