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
import { permanentRedirect } from "next/navigation";
import { userAgent } from 'next/server'

const getCampaign = async (offer_id: string) => {
  try {
    console.log(`${process.env.API_URL}campaign/?offer_id=${offer_id}`)

    const response = await fetch(
      `${process.env.API_URL}campaign/?offer_id=${offer_id}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch campaign");
    }
    const data = await response.json(); // Process the JSON body
    // console.log(data, "response data"); // Log the actual response data
    return data; // Return the parsed data
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
  const isPermanentRedirect = data?.permanent_redirect;
  let redirectUrl = data?.buttons[0]?.url;
  let href = data?.buttons[0]?.url;
  const buttonType = data?.buttons[0]?.type;
  console.log(data, "data");

  if (isPermanentRedirect) {
    console.log(userAgent, "userAgent");
    const extractASIN = (url: string) => {
      const match = url.match(/\/dp\/([A-Z0-9]{10})/);
      return match ? match[1] : null;
    };
    const asin = extractASIN(href);
    if (asin) {
      if (buttonType === "amazon") {
        redirectUrl = `https://staging-links.instalanding.in/amazon-redirect/?redirect_url=${href}&ctatype=${buttonType}`
        // if (/android/i.test(userAgent.toString())) {
        //   redirectUrl = `intent://www.amazon.in/dp/${asin}#Intent;scheme=https;package=in.amazon.mShop.android.shopping;end`;
        // } else if (/iPad|iPhone|iPod/.test(userAgent.toString()) && !/windows/i.test(userAgent.toString())) {
        //   redirectUrl = `com.amazon.mobile.shopping://www.amazon.in/dp/${asin}`;
        // } else {
        //   redirectUrl = href;
        // }
      } else {
        if (/android/i.test(userAgent.toString())) {
          redirectUrl = `intent:${href.replace(/^https?:\/\//, '')}#Intent;package=com.android.chrome;scheme=https;action=android.intent.action.VIEW;end;`;
        } else if (/iPad|iPhone|iPod/.test(userAgent.toString()) && !/windows/i.test(userAgent.toString())) {
          redirectUrl = href.startsWith('http') ? href : `https://${href}`;
        } else {
          redirectUrl = href;
        }
      }
      permanentRedirect(redirectUrl);
    } else {
      console.error("ASIN not found in the URL");
    }
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
                src={`https://www.facebook.com/tr?id=${data.pixel.id}&ev=ViewContent&noscript=1&cd[content_name]=${data.creative.title || "Offer"
                  }&cd[content_category]=Offer&cd[content_ids]=${data.variant_id || "none"
                  }&cd[content_type]=${data.product_handle || "none"}&cd[value]=${data.price.offerPrice.value || 0
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
          campaign_id={data._id}
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
                src={`https://www.facebook.com/tr?id=${data.pixel.id
                  }&ev=ViewContent&noscript=1&cd[content_name]=${data.creative.title || "Offer"
                  }&cd[content_category]=Offer&cd[content_ids]=${data.variant_id || "none"
                  }&cd[content_type]=${data.product_handle || "none"}&cd[value]=${data.price.offerPrice.value || 0
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
          campaign_id={data._id}
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
