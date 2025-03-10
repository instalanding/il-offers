'use client';

import React, { useEffect, useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductImage } from './ProductImage';
import Image from 'next/image';

interface CarouselProps {
  images: { url: string }[];
  variantId: string;
}

const CarouselComponent: React.FC<CarouselProps> = ({ images, variantId }) => {
    const placeholderImages = [
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" }
    ];

    const finalImages = (images && images.length > 0) ? images : placeholderImages;
    
    // Check if the specific variantId is present for badge
    const showBadge = variantId === "41056148652078";
    const badgeRef = useRef<HTMLImageElement>(null);
    const badgeUrl = "https://res.cloudinary.com/duslrhgcq/image/upload/v1741422279/b8gtnbw9u7rw5uk0n0pc.png";

    // Preload badge image if needed
    useEffect(() => {
        if (showBadge) {
            const img = new (window as any).Image();
            img.src = badgeUrl;
        }
    }, [showBadge, badgeUrl]);

    return (
        <div className="carousel-wrapper">
            <Carousel>
                <CarouselContent>
                    {finalImages.map((image, key) => (
                        <CarouselItem key={key}>
                            <div className="relative">
                                <ProductImage
                                    src={image?.url}
                                    alt={key === 0 ? "Main Product Image" : `Product Image ${key+1}`}
                                    width={480}
                                    height={480}
                                    className={`w-full ${key === 0 ? 'main-product-image' : ''}`}
                                    isLCP={key === 0} // Mark the first image as LCP
                                />
                                
                                {showBadge && key === 0 && (
                                    <div className="absolute top-2 left-1 z-10">
                                        <Image
                                            ref={badgeRef}
                                            src={badgeUrl}
                                            alt="Badge"
                                            width={60}
                                            height={60}
                                            priority={true}
                                        />
                                    </div>
                                )}
                            </div>
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