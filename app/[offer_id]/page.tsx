"use server";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import MultipleCTA from "@/components/landingPage/MultipleCTA";
import NotFound from "@/components/landingPage/NotFound";
import RecordImpressions from "@/components/recordImpressions/page";
import NewLandingPage from "@/components/newLandingPage/NewLandingPage";
import { headers } from "next/headers";
import Domain from "./Domain";
import Image from "next/image";

const getCampaign = async (offer_id: string) => {
  try {
    const response = await fetch(
    
      `${process.env.API_URL}/campaign/?offer_id=${offer_id}`,
      { cache: "no-store" }
    );

    console.log("resss",response)
    if (!response.ok) {
      throw new Error("Failed to fetch campaign");
    }
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

const Coupon = async ({
  params,
  searchParams,
}: {
  params: { offer_id: string };
  searchParams: { mode: string; user_ip?: any };
}) => {
  const offer_id = params.offer_id;
  const userIp = searchParams.user_ip ?? "";
  const utm_params = searchParams;
  const headersList = headers();
  const domain = headersList.get("host");

  if (!offer_id) {
    return <h1 className="font-semibold text-red-600">Offer id missing!</h1>;
  }

  const data = await getCampaign(offer_id);
  if (!data) return <NotFound />;

  const domainUrls = Array.isArray(data.domains) ? data.domains : [];

  

  const isAllowedDomain = domainUrls.includes(domain) || domain === "localhost:3200";

  if (!isAllowedDomain) {
    console.log("Domain not allowed:", domain);
    return <NotFound />;
  }

  if (data.templateType && data.templateType === "new-landing") {
    return (
      <>
        <Domain domain={domain} />
        {data.pixel && (
          <>
            <img
              height={1}
              width={1}
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${data.pixel.id}&ev=PageView&noscript=1`}
              alt="Facebook Pixel"
            />
            {data.variant_id && (
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${data.pixel.id}&ev=ViewContent&noscript=1&cd[content_name]=${
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
          offer_id={offer_id}
          advertiser={data.advertiser}
          user_ip={userIp}
          store_url={data.store_url}
          tags={data?.tags}
          utm_params={utm_params}
        />
        <NewLandingPage
          schema={data}
          logo={data.store_logo}
          offer_id={offer_id}
          advertiser={data.advertiser}
          user_ip={userIp}
          store_url={data.store_url}
          tags={data?.tags}
          utm_params={utm_params}
        />
      </>
    );
  }

  if (data.templateType && data.templateType === "multiple-cta") {
    return (
      <>
        <Domain domain={domain} />
        {offer_id === "6a81a" && (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=AW-705273883"
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-705273883');

            function gtag_report_conversion_zomato(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-705273883/hR2RCLeQjOEZEJvAptAC',
                  'value': 1.0,
                  'currency': 'INR',
                  'event_callback': callback
              });
              return false;
            }

            `,
              }}
            />
          </>
        )}
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
          offer_id={offer_id}
          advertiser={data.advertiser}
          user_ip={userIp}
          store_url={data.store_url}
          tags={data?.tags}
          utm_params={utm_params}
        />
        <MultipleCTA
          pixel={data.pixel ? data.pixel.id : ""}
          schema={data}
          logo={data.store_logo}
          offer_id={offer_id}
          userIp={userIp}
        />
      </>
    );
  }
};

export default Coupon;

export async function generateMetadata(
  { params, searchParams }: { params: { offer_id: string }; searchParams: any },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const offer_id = params.offer_id;

  // Fetch campaign data based on offer_id
  const data = await getCampaign(offer_id);

  // Default fallback values for metadata
  const title = data?.creative?.title || "Instalanding Offers";
  const description = data?.store_description || "Explore exclusive offers with Instalanding.";
  const imageUrl =
    data?.templateType === "multiple-cta" || data?.templateType === "new-landing"
      ? data?.creative?.carousel_images?.[0] || "/default-meta-image.jpg"
      : data?.creative?.image || "/default-meta-image.jpg";

  return {
    title,
    description,
    icons: [{ rel: "icon", url: data?.store_logo || "/favicon.ico" }],
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
      "theme-color": data?.config?.button1Color || "#ffffff",
    },
  };
}

