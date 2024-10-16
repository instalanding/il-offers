"use server";
import { TermsAndConditions } from "@/components/coupon/TermsAndConditions";
import createGradient from "@/lib/createGradient";
import Image from "next/image";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import { SaveOfferDialog } from "@/components/coupon/SaveOffer";
import { formatDate } from "@/lib/dateFormat";
import { ShareDialog } from "@/components/coupon/ShareDialog";
import Reedem from "@/components/coupon/Reedem";
import QrComponent from "@/components/coupon/QrComponent";
import Link from "next/link";
import FlipCard from "@/components/landingPage/FlipCard";
import MultipleCTA from "@/components/landingPage/MultipleCTA";
import NotFound from "@/components/landingPage/NotFound";
import { getVisitorId } from "@/lib/fingerprint";
import RecordImpressions from "@/components/recordImpressions/page";
import { permanentRedirect } from "next/navigation";
import { fetchApi } from "@/lib/backendFunctions";
import axios from "axios";
import { headers } from "next/headers";
import Script from "next/script";
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

const recordImpressions = async (
  offer_id: string,
  advertiser_id: string,
  userIp: string,
  product_url: string,
  tags: any
) => {
  try {
    const response = await fetch(
      `${process.env.API_URL}clicks-impressions/?offer_id=${offer_id}&advertiser_id=${advertiser_id}&user_ip=${userIp}&product_url=${product_url}&tags=${tags}`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error("Failed to record impressions");
    }
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

const fbPixelEvents = async (pixelId: string) => {
  try {
    const response = await fetch(
      `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error("Failed to fire facebook pixel");
    }
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
  const previousImages = (await parent).openGraph?.images || [];

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
