import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';

const CarouselComponent: React.FC<{ images: { url: string }[] }> = ({ images }) => {
    const placeholderImages = [
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" }
    ];

    const finalImages = (images && images.length > 0) ? images : placeholderImages;

    const getOptimizedImageUrl = (url: string, width: number, quality: number = 75) => {
        if (!url) return ""; // Prevent errors if URL is undefined

        const cloudinaryBaseUrl = "https://res.cloudinary.com/";

        if (url.startsWith(cloudinaryBaseUrl)) {
            // Cloudinary Optimized Parameters
            return `${url.replace("/upload/", `/upload/c_scale,w_${width},q_auto:good,f_auto/`)}`;
        }

        return url; // Return original URL if not from Cloudinary
    };

    return (
        <div>
            <Carousel>
                <CarouselContent>
                    {finalImages.map((image, key) => (
                        <CarouselItem key={key}>
                            <Image
                                alt="Main Image"
                                src={getOptimizedImageUrl(image?.url, 480)}
                                width={480}
                                height={480}
                                className="w-full"
                                priority={key === 0} // First image loads eagerly
                                loading={key !== 0 ? "lazy" : "eager"} // Others lazy-load
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." // Base64 Placeholder
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-[7px] shadow-md" />
                <CarouselNext className="right-[7px] shadow-md" />
            </Carousel>
        </div>
    );
};

export default CarouselComponent;