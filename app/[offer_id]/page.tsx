"use server";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import V2 from "@/components/v2/v2";
import FontLoader from "@/components/v2/FontLoader";
import { MdErrorOutline } from "react-icons/md";
import { formatDate } from "@/lib/formatUtils";

const getCampaign = async (params: { offer_id?: string }) => {
  try {
    const { offer_id } = params;
    const query = new URLSearchParams();

    if (offer_id) query.append("offer_id", offer_id);

    const response = await fetch(
      `${process.env.API_URL_V2}campaign?${query.toString()}`,
      { cache: "no-store" }
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

<<<<<<< HEAD
const getCollections = async (slug: string, variant_id: string) => {
  try {
    const response = await fetch(
      `${process.env.API_URL_V2}collection?slug=${slug}&variant_id=${variant_id}`, {
      cache: "no-store",
    });
    console.log(response);
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error fetching collections:", errorResponse);
      throw new Error("Failed to fetch collections");
=======
type SearchParams = {
  os?: string;
  cpu?: string;
  isBot?: string;
  ua?: string;
  browser?: string;
  device?: string;
  engine?: string;
  user_ip?: string;

};

const Coupon = async ({
  params,
  searchParams,
}: {
  params: { offer_id: string };
  searchParams: SearchParams;
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
  const isGoogleBot = searchParams.isBot === 'true';
  const ua = searchParams.ua || '';
  const browser = JSON.parse(searchParams.browser || '{}');
  const device = JSON.parse(searchParams.device || '{}');
  const engine = JSON.parse(searchParams.engine || '{}');


  if (isPermanentRedirect) {
    console.log(isGoogleBot, "isGoogleBotisGoogleBot")
    if (isGoogleBot) {
      const formattedUrl = href.startsWith("http") ? href : `https://${href}`;
    const parsedUrl = new URL(formattedUrl);
    const fullDomain = parsedUrl.hostname;
    // const mainDomain = process.env.NODE_ENV === 'development'
    //   ? 'bombaysweetshop.com'
    //   : `${fullDomain.split('.').slice(-2).join('.')}`;
    const mainDomain = "bombaysweetshop.com"
    const queryParams = new URLSearchParams(parsedUrl.search);
    const redirectUrl = `https://${mainDomain}/?${queryParams.toString()}`;
    permanentRedirect(redirectUrl);
    } else if (buttonType === "amazon") {
      redirectUrl = `${process.env.REDIRECT_SCRIPT_URL}amazon-redirect/?redirect_url=${href}&ctatype=${buttonType}`;
    } else {
      if (/android/i.test(userAgent.toString())) {
        redirectUrl = `intent:${href.replace(/^https?:\/\//, '')}#Intent;package=com.android.chrome;scheme=https;action=android.intent.action.VIEW;end;`;
      } else if (/iPad|iPhone|iPod/.test(userAgent.toString()) && !/windows/i.test(userAgent.toString())) {
        redirectUrl = href.startsWith('http') ? href : `https://${href}`;
      }
>>>>>>> bc94517891f88acbdfd9c834e43120d87e7099df
    }
    const data = await response.json();
    console.log(data)
    return data.data;
  } catch (error) {
    console.log(error)
  }
}

const getReviews = async (product_handle: string) => {
  try {
    const response = await fetch(`${process.env.API_URL_V2}/reviews?slug=${product_handle}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error fetching reviews:", errorResponse);
      throw new Error("Failed to fetch reviews");
    }
    const data = await response.json();
    return data.statusCode.data;
  } catch (error) {
    console.log(error);
  }
};

const Campaign = async ({
  params
}: {
  params: { offer_id?: string };
}) => {
  const { offer_id } = params;
  const data = await getCampaign({ offer_id });
  const apiReviews = data ? await getReviews(data.product_handle) : [];
  const collections = data ? await getCollections(data.product_handle, data.variant_id) : [];

  const reviews = apiReviews?.map((review: any) => ({
    userName: review.reviewer_name,
    comment: review.review_body_text,
    rating: review.review_rating,
    date: formatDate(review.review_date)
  }));

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 rounded-md shadow-md">
        <MdErrorOutline className="text-red-600 text-6xl mb-4" />
        <h1 className="font-bold text-red-600 text-lg mb-2">Campaign Not Found</h1>
        <p className="text-gray-600 text-sm text-center">
          The campaign you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
      </div>
    );
  }

  const fontFamily = data?.config?.font_family || "Inter";

  return (
    <>
      <FontLoader fontFamily={fontFamily} />
      <V2 campaignData={{ ...data, config: { ...data.config, font_family: fontFamily }, reviews, collections }} />
    </>
  );
};

export default Campaign;

export async function generateMetadata(
  { params, searchParams }: { params: { offer_id?: string; slug?: string; variant_id?: string }; searchParams: any },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { offer_id, slug, variant_id } = params;
  const data = await getCampaign({ offer_id });

  const title = data?.meta_description?.title || "Instalanding Offers";
  const description = data?.meta_description?.description || "Explore exclusive offers with Instalanding.";
  const imageUrl = data?.meta_description?.image?.url || "/default-meta-image.jpg";

  return {
    title,
    description,
    icons: [{ rel: "icon", url: data?.advertiser?.store_logo || "/favicon.ico" }],
    openGraph: {
      title,
      description,
      url: `https://instalanding.shop/${offer_id || slug}`,
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
      "theme-color": data?.config?.primary_color || "#ffffff",
    },
  };
}