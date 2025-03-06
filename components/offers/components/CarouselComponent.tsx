import React, { useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const CarouselComponent: React.FC<{ images: { url: string }[]; prefix: string }> = ({ images, prefix }) => {
    const placeholderImages = [
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" }
    ];

    const finalImages = (images && images.length > 0) ? images : placeholderImages;
    
    // Ensure prefix doesn't have '@' if present
    const cleanPrefix = prefix.startsWith('@') ? prefix.substring(1) : prefix;
    
    // Get direct Cloudinary URL without Next.js image processing
    const getOptimizedUrl = (imageUrl:string) => {
        // Extract only the Cloudinary URL part if it's going through Next.js
        if (imageUrl.includes('_next/image')) {
            const match = imageUrl.match(/url=([^&]+)/);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        }
        return `${cleanPrefix}${imageUrl}`;
    };
    
    // Preload first image with high priority
    useEffect(() => {
        if (finalImages && finalImages.length > 0 && typeof window !== 'undefined') {
            // Create and add the preload link
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = getOptimizedUrl(finalImages[0]?.url);
            document.head.appendChild(preloadLink);
            
            return () => {
                document.head.removeChild(preloadLink);
            };
        }
    }, [finalImages, cleanPrefix]);

    return (
        <div>
            <Carousel>
                <CarouselContent>
                    {finalImages.map((image, key) => (
                        <CarouselItem key={key}>
                            {key === 0 ? (
                                // First image - critical for LCP
                                <img
                                    src={getOptimizedUrl(image?.url)}
                                    alt="Product Image"
                                    width="480"
                                    height="480"
                                    className="w-full"
                                    loading="eager"
                                    fetchPriority="high"
                                    decoding="sync"
                                    style={{
                                        objectFit: 'contain',
                                        aspectRatio: '1/1',
                                        backgroundColor: '#f5f5f5'
                                    }}
                                />
                            ) : (
                                // Non-LCP images
                                <img
                                    src={getOptimizedUrl(image?.url)}
                                    alt="Product Image"
                                    width="480"
                                    height="480"
                                    className="w-full"
                                    loading="lazy"
                                    decoding="async"
                                    style={{
                                        objectFit: 'contain',
                                        aspectRatio: '1/1',
                                        backgroundColor: '#f5f5f5'
                                    }}
                                />
                            )}
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