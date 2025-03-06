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
    
    // Preload the first image for better LCP
    useEffect(() => {
        if (finalImages && finalImages.length > 0 && typeof window !== 'undefined') {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = `${cleanPrefix}${finalImages[0]?.url}`;
            preloadLink.type = 'image/avif';
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
                            <picture>
                                {/* AVIF format will be used if browser supports it */}
                                <source 
                                    type="image/avif" 
                                    srcSet={`
                                        ${cleanPrefix}${image?.url} 480w,
                                        ${cleanPrefix.replace('w_800', 'w_960')}${image?.url} 960w
                                    `}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                
                                {/* Base image - will be used if browser doesn't support AVIF */}
                                <img
                                    src={`${cleanPrefix}${image?.url}`}
                                    alt="Product Image"
                                    width="480"
                                    height="480"
                                    className="w-full"
                                    loading={key === 0 ? "eager" : "lazy"}
                                    fetchPriority={key === 0 ? "high" : "auto"}
                                    onLoad={key === 0 ? () => {
                                        // Mark when LCP image loads for performance tracking
                                        if (typeof window !== 'undefined') {
                                            window.performance.mark('lcp-image-loaded');
                                        }
                                    } : undefined}
                                    style={{
                                        objectFit: 'contain',
                                        aspectRatio: '1/1',
                                        backgroundColor: '#f5f5f5'
                                    }}
                                />
                            </picture>
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