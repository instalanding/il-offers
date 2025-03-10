'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductImage } from './ProductImage';

interface CarouselProps {
  images: { url: string }[];
  variantId: string;
}

const CarouselComponent: React.FC<CarouselProps> = ({ images, variantId }) => {
    // Memoize placeholder images to avoid recreating on each render
    const placeholderImages = useMemo(() => [
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" }
    ], []);

    // Memoize finalImages to avoid recreating array on each render
    const finalImages = useMemo(() => 
        (images && images.length > 0) ? images : placeholderImages, 
        [images, placeholderImages]
    );
    
    // Check if the specific variantId is present for badge
    const showBadge = variantId === "41056148652078";
    const badgeRef = useRef<HTMLImageElement>(null);
    const badgeUrl = "https://res.cloudinary.com/duslrhgcq/image/upload/v1741422279/b8gtnbw9u7rw5uk0n0pc.png";

    // Preload badge image if needed - only run when showBadge changes
    useEffect(() => {
      if (showBadge) {
        const img = new Image();
        img.src = badgeUrl;
      }
    }, [showBadge, badgeUrl]);
    
    // Memoize rendering of the carousel items to prevent recreating on each render
    const carouselItems = useMemo(() => 
        finalImages.map((image, index) => (
            <CarouselItem key={`carousel-item-${index}-${image.url}`}>
                <div className="relative">
                    <ProductImage
                        src={image?.url}
                        alt={index === 0 ? "Main Product Image" : `Product Image ${index+1}`}
                        width={480}
                        height={480}
                        className={`w-full ${index === 0 ? 'main-product-image' : ''}`}
                        isLCP={index === 0} // Mark the first image as LCP
                    />
                    
                    {showBadge && index === 0 && (
                        <div className="absolute top-2 left-1 z-10">
                            <img
                                ref={badgeRef}
                                src={badgeUrl}
                                alt="Badge"
                                width={60}
                                height={60}
                                className="w-[60px] h-[60px]"
                            />
                        </div>
                    )}
                </div>
            </CarouselItem>
        )),
        [finalImages, showBadge, badgeUrl]
    );

    return (
        <div className="carousel-wrapper">
            <Carousel>
                <CarouselContent>
                    {carouselItems}
                </CarouselContent>
                <CarouselPrevious className="left-[7px] shadow-md" />
                <CarouselNext className="right-[7px] shadow-md" />
            </Carousel>
        </div>
    );
};

// Use memo to prevent unnecessary rerenders of the entire carousel
export default React.memo(CarouselComponent);