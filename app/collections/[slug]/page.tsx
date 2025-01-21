"use server";
import React from "react";
import { MdErrorOutline } from "react-icons/md";
import Collections from "@/components/v2/Collections";
import { Metadata, ResolvingMetadata } from "next";
import FontLoader from "@/components/v2/FontLoader";
const getCollections = async (slug: string, variant_id?: string) => {
    try {
        const query = new URLSearchParams({ slug });
        if (variant_id) {
            query.append("variant_id", variant_id);
        }

        const response = await fetch(
            `${process.env.API_URL_V2}collection?${query.toString()}`, {
            cache: "no-store",
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Error fetching collections:", errorResponse);
            throw new Error("Failed to fetch collections");
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.log(error);
    }
};

const Collection = async ({
    params
}: {
    params: { slug: string; variant_id?: string };
}) => {
    const { slug, variant_id } = params;
    const collections = await getCollections(slug, variant_id);

    if (!collections) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 rounded-md shadow-md">
                <MdErrorOutline className="text-red-600 text-6xl mb-4" />
                <h1 className="font-bold text-red-600 text-lg mb-2">Collections Not Found</h1>
                <p className="text-gray-600 text-sm text-center">
                    The collections you're looking for don't exist or may have been removed.
                </p>
            </div>
        );
    }
    const fontFamily = collections?.config?.font_family || "Inter";

    return (
        <>
            <FontLoader fontFamily={fontFamily} />
            <Collections data={collections} />
        </>
    );
};

export default Collection;
export async function generateMetadata(
    { params }: { params: { slug: string; variant_id?: string }; searchParams: any },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug, variant_id } = params;
    const data = await getCollections(slug, variant_id);

    const title = data?.meta_description?.title || "Instalanding Offers";
    const description = data?.meta_description?.description || "Explore exclusive offers with Instalanding.";
    const imageUrl = data?.meta_description?.image?.url || "/default-meta-image.jpg";

    return {
        title,
        description,
        icons: [{ rel: "icon", url: data?.meta_description?.icon.url || "/favicon.ico" }],
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
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
        other: {
            "theme-color": "#ffffff",
            // data?.config?.primary_color ||
        },
    };
}