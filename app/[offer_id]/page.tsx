"use server";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import MultipleCTA from "@/components/landingPage/MultipleCTA";
import NotFound from "@/components/landingPage/NotFound";
import RecordImpressions from "@/components/recordImpressions/page";
import NewLandingPage from "@/components/newLandingPage/NewLandingPage";
import { headers } from "next/headers";
import Domain from "./Domain";

const getCampaign = async (offer_id: string) => {
  try {
    const response = await fetch(
      `${process.env.API_URL}coupon/?offer_id=${offer_id}`,
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

  console.log(data.pixel);

  console.log(domain);
  console.log(offer_id, "utm_paramsutm_params")

  const domainUrls =
    data.domains && Array.isArray(data.domains)
      ? data.domains.map((d: { url: string }) => d.url)
      : [];

  const isAllowedDomain =
    domainUrls.includes(domain) || domain === "localhost:3200";

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
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const offer_id = params.offer_id;

  const data = await getCampaign(offer_id);
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
      "og:url": `https://instalanding.shop/${offer_id}`,
      "og:image": imageUrl,
      "og:type": "website",
    },
  };
}
