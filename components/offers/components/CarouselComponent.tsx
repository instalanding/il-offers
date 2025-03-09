'use client';

import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';

const optimizeCloudinaryUrl = (url: string | undefined): string => {
    // Only process Cloudinary URLs
    if (!url || !url.includes('cloudinary.com')) return url || '';
    
    // Extract base URL and transformation parts
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    
    // Add optimized transformations for the first image (LCP image)
    // Use q_auto:good for better quality-to-size ratio and format auto for WebP/AVIF
    return `${parts[0]}/upload/f_auto,q_auto:good,w_480,dpr_2.0,c_limit/${parts[1]}`;
};

// Preload first image to improve LCP
const preloadLCPImage = (images: { url: string }[]) => {
    if (typeof document === 'undefined') return;
    
    if (images && images.length > 0 && images[0]?.url) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = optimizeCloudinaryUrl(images[0].url);
        document.head.appendChild(link);
    }
};

const CarouselComponent: React.FC<{ images: { url: string }[], variantId: string }> = ({ images, variantId }) => {
    const placeholderImages = [
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" }
    ];

    const finalImages = (images && images.length > 0) ? images : placeholderImages;
    
    // Attempt to preload the LCP image
    React.useEffect(() => {
        preloadLCPImage(finalImages);
    }, [finalImages]);
    
    // Check if the specific variantId is present
    const showBadge = variantId === "41056148652078";
    const badgeUrl = "https://res.cloudinary.com/duslrhgcq/image/upload/v1741422279/b8gtnbw9u7rw5uk0n0pc.png";

    return (
        <div className="carousel-wrapper">
            <Carousel>
                <CarouselContent>
                    {finalImages.map((image, key) => (
                        <CarouselItem key={key}>
                            <div className="relative">
                                {key === 0 ? (
                                    // Optimize the LCP image with special handling
                                    <Image
                                        alt="Main Product Image"
                                        src={optimizeCloudinaryUrl(image?.url)}
                                        width={480}
                                        height={480}
                                        className="w-full main-product-image"
                                        fetchPriority="high"
                                        priority
                                        loading="eager"
                                        quality={85}
                                        sizes="(max-width: 768px) 100vw, 480px"
                                        // Use a simpler placeholder to reduce JS processing
                                        placeholder="empty"
                                        // Disable blur effect to eliminate processing time
                                        unoptimized={false}
                                    />
                                ) : (
                                    // Secondary images can load with default settings
                                    <Image
                                        alt={`Product Image ${key+1}`}
                                        src={image?.url}
                                        width={480}
                                        height={480}
                                        className="w-full"
                                        loading="lazy"
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                                        sizes="(max-width: 768px) 100vw, 480px"
                                    />
                                )}
                                {showBadge && key === 0 && (
                                    <div className="absolute top-2 left-1 z-10">
                                        <Image
                                            src={badgeUrl}
                                            alt="Badge"
                                            width={60}
                                            height={60}
                                            priority
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