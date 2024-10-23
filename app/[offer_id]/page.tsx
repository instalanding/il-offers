"use server";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import FlipCard from "@/components/landingPage/FlipCard";
import MultipleCTA from "@/components/landingPage/MultipleCTA";
import NotFound from "@/components/landingPage/NotFound";
import RecordImpressions from "@/components/recordImpressions/page";
import { permanentRedirect } from "next/navigation";
import NewLandingPage from "@/components/newLandingPage/NewLandingPage";

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
  const mode = searchParams.mode;
  const userIp = searchParams.user_ip ?? "";

  if (!offer_id) {
    return <h1 className="font-semibold text-red-600">Offer id missing!</h1>;
  }

  const data = await getCampaign(offer_id);
  if (!data) return <NotFound />;

  if (offer_id === "e8f76") {
    const redirectUrl = encodeURIComponent(data.buttons[0].url);
    permanentRedirect(
      `https://links.instalanding.in/redirect/?offer_id=${offer_id}&advertiser_id=${data.advertiser}&tags=${data?.tags}&redirect_url=${redirectUrl}&ctatype=${data.buttons[0].type}`
    );
  }

  console.log(data.pixel);

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
          offer_id={offer_id}
          advertiser={data.advertiser}
          user_ip={userIp}
          store_url={data.store_url}
          tags={data?.tags}
        />
        <NewLandingPage
          schema={data}
          logo={data.store_logo}
          offer_id={offer_id}
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

  return (
    <>
      <RecordImpressions
        offer_id={offer_id}
        advertiser={data.advertiser}
        user_ip={userIp}
        store_url={data.store_url}
        tags={data?.tags}
      />
      <FlipCard data={data} offer_id={offer_id} userIp={userIp} />
    </>
  );
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
      //  ...(shouldIncludeFbPixel && { "fb-pixel-script": fbPixelScript }),
    },
  };
}
