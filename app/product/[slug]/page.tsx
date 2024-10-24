import MultipleCTA from "@/components/landingPage/MultipleCTA";
import NotFound from "@/components/landingPage/NotFound";
import NewLandingPage from "@/components/newLandingPage/NewLandingPage";
import RecordImpressions from "@/components/recordImpressions/page";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

const getCampaign = async (slug: string) => {
  try {
    const response = await fetch(
      `${process.env.API_URL}campaign/?slug=${slug}`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch campaign");
    }
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

interface CampaignProps {
  params: { slug: string };
  searchParams: { mode: string; user_ip?: any };
}

const Campaign = async ({ params, searchParams }: CampaignProps) => {
  const slug = params.slug;
  const userIp = searchParams.user_ip ?? "";
  const headersList = headers();
  const domain = headersList.get("host");

  if (!slug) {
    return (
      <h1 className="font-semibold text-red-600">Product handle is missing!</h1>
    );
  }

  const data = await getCampaign(slug);
  if (!data) return <NotFound />;

  console.log(data.pixel);

  console.log(domain);

  if (data.domain.url !== domain && domain !== "localhost:3200") {
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
          offer_id={slug}
          advertiser={data.advertiser}
          user_ip={userIp}
          store_url={data.store_url}
          tags={data?.tags}
        />
        <NewLandingPage
          schema={data}
          logo={data.store_logo}
          offer_id={slug}
          advertiser={data.advertiser}
          user_ip={userIp}
          store_url={data.store_url}
          tags={data?.tags}
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
          offer_id={slug}
          advertiser={data.advertiser}
          user_ip={userIp}
          store_url={data.store_url}
          tags={data?.tags}
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
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;

  const data = await getCampaign(slug);
  console.log(data, "data ");

  const title = data?.creative?.title || "Instalanding offers";
  const description = data?.store_description || "Instalanding Offering";
  const imageUrl =
    data?.templateType === "multiple-cta" ||
    data?.templateType === "new-landing"
      ? data?.creative?.carousel_images?.[0]
      : data?.creative?.image;

  return {
    title: title,
    description: description,
    icons: [{ rel: "icon", url: data?.store_logo }],
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
      "theme-color": data?.config?.button1Color,
      "twitter:image": imageUrl,
      "twitter:card": "summary_large_image",
      "og:url": `https://instalanding.shop/${slug}`,
      "og:image": imageUrl,
      "og:type": "website",
    },
  };
}
