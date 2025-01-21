"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CollectionsProps {
    data: {
        campaign_title: string;
        description: string;
        price: {
            offerPrice: { value: string; prefix: string };
            originalPrice: { value: string; prefix: string };
            discount: string;
        };
        meta_description: {
            image: { url: string };
        };
        product_handle?: string;
        offer_id?: string;
        variant: Array<{
            _id: string;
            campaign_title: string;
            description: string;
            price: {
                offerPrice: { value: string; prefix: string };
                originalPrice: { value: string; prefix: string };
                discount: string;
            };
            meta_description: {
                image: { url: string };
            };
            product_handle?: string;
            variant_id?: string;
            offer_id?: string;
        }>;
        config: {
            font_family: string;
            primary_color: string;
            secondary_color: string;
            header_text: string;
            footer_text: string;
            button_text: string;
        };
    };
}

const Collections: React.FC<CollectionsProps> = ({ data }) => {
    const router = useRouter();

    const handleCardClick = (variant: typeof data.variant[0]) => {
        if (variant.product_handle) {
            router.push(`/products/${variant.product_handle}?variant_id=${variant.variant_id}`);
        } else if (variant.offer_id) {
            router.push(`/${variant.offer_id}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <div className="sticky top-0 h-auto z-50">
                <p
                    style={{
                        backgroundColor: "#073e0a",
                        color: 'white',
                    }}
                    className="text-[12px] text-center p-2 px-6"
                >
                    Buy 2 Get 1 FREE
                </p>
                <div className="flex flex-col items-center justify-center py-2 bg-white -z-50">
                    <Image
                        alt={"upload a logo"}
                        // src={"https://cdn.prod.website-files.com/63ad1b6ffdf77fc81d8ffbd0/6446d79cca09a8138f51b8d1_foxtale.svg"}
                        src={"https://res.cloudinary.com/duslrhgcq/image/upload/v1732677222/lbjwkpakjmxeos1cpedq.png"}
                        className="h-[60px] py-2 height-auto object-contain"
                        width={310}
                        height={310}
                    />
                </div>
            </div>
            <Image src={"https://saptamveda.com/cdn/shop/files/Group-02_70c7f1fa-78c4-4612-a668-c831e60a8221.jpg?v=1642836797"}
                alt="saptamveda banner image"
                width={1500}
                height={1000}
                className='w-full'
            />
            <main className="flex-grow p-6">

                <div className="mt-2 mb-6 text-gray-700 text-center">
                    <p className="text-2xl font-medium">
                        Discover our exclusive collection of products
                    </p>
                    <p className="mt-2 text-sm">
                        <span className="font-semibold">{data.variant.length} Products</span>
                    </p>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.variant.map((variant) => (
                        <div
                            key={variant._id}
                            className="relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            onClick={() => handleCardClick(variant)}
                        >

                            {variant.price.discount !== '0.00' && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
                                    {variant.price.discount}% OFF
                                </div>
                            )}

                            <Image src={variant.meta_description.image.url}
                                alt="Image"
                                height={340}
                                width={340}
                                className='rounded-t-lg'
                            />


                            <div className="p-4 ">
                                <h2 className="text-lg font-semibold text-gray-800">{variant.campaign_title}</h2>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{variant.description}</p>
                                <div className="mt-3 flex items-center justify-between">
                                    {/* Offer Price */}
                                    <span className="text-green-600 font-bold text-lg">
                                        {variant.price.offerPrice.prefix}
                                        {variant.price.offerPrice.value}
                                    </span>
                                    {/* Original Price */}
                                    {variant.price.discount !== '0.00' && (
                                        <span className="text-gray-400 line-through text-sm">
                                            {variant.price.originalPrice.prefix}
                                            {variant.price.originalPrice.value}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Collections;