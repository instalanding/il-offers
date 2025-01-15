"use server";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import V2 from "@/components/v2/v2";
import FontLoader from "@/components/v2/FontLoader";
import { MdErrorOutline } from "react-icons/md";
// import NotFound from "@/components/landingPage/NotFound";

const getCampaign = async (params: { offer_id?: string }) => {
  try {
    const { offer_id } = params;
    const query = new URLSearchParams();

    if (offer_id) query.append("offer_id", offer_id);

    const response = await fetch(
      `${process.env.API_URL_V2}campaign?${query.toString()}`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error fetching campaign:", errorResponse);
      throw new Error("Failed to fetch campaign");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

// const getCollection = async (params: { offer_id?: string }) => {
//   try {
//     const { offer_id } = params;
//     const query = new URLSearchParams();

//     if (offer_id) query.append("offer_id", offer_id);

//     const response = await fetch(
//       `${process.env.API_URL_V2}collection?${query.toString()}`,
//       { cache: "no-store" }
//     );
//     if (!response.ok) {
//       const errorResponse = await response.json();
//       console.error("Error fetching collection:", errorResponse);
//       throw new Error("Failed to fetch collection");
//     }
//     const data = await response.json();
//     console.log("colllection_____", data);
//     return data.data;
//   } catch (error) {
//     console.log(error);
//   }
// }

const Campaign = async ({
  params
}: {
  params: { offer_id?: string };
}) => {
  const { offer_id } = params;

  const data = await getCampaign({ offer_id });
  // const collection = await getCollection({ offer_id });
  // console.log(collection);
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 rounded-md shadow-md">
        <MdErrorOutline className="text-red-600 text-6xl mb-4" />
        <h1 className="font-bold text-red-600 text-lg mb-2">Campaign Not Found</h1>
        <p className="text-gray-600 text-sm text-center">
          The campaign you’re looking for doesn’t exist or may have been removed.
        </p>
      </div>
      // <NotFound />
    );
  }

  const fontFamily = data?.config?.font_family || "Inter";
  return (
    <>
      <FontLoader fontFamily={fontFamily} />
      <V2 campaignData={{ ...data, config: { ...data.config, font_family: fontFamily } }} />
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