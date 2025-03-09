import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';

const CarouselComponent: React.FC<{ images: { url: string }[], variantId: string }> = ({ images, variantId }) => {
    // Use a single placeholder with appropriate dimensions instead of multiple
    const placeholderImage = "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp";
    const placeholderImages = Array(3).fill({ url: placeholderImage });

    const finalImages = (images && images.length > 0) ? images : placeholderImages;
    
    // Check if the specific variantId is present
    const showBadge = variantId === "41056148652078";
    const badgeUrl = "https://res.cloudinary.com/duslrhgcq/image/upload/v1741422279/b8gtnbw9u7rw5uk0n0pc.png";

    //console.log(variantId, "variantId")

    return (
        <div>
            <Carousel>
                <CarouselContent>
                    {finalImages.map((image, key) => (
                        <CarouselItem key={key}>
                            <div className="relative">
                                <Image
                                    alt={"Product Image " + (key + 1)}
                                    src={image?.url}
                                    width={480}
                                    height={480}
                                    className="w-full"
                                    priority={key === 0} // Only prioritize the first image
                                    loading={key === 0 ? "eager" : "lazy"}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    quality={key === 0 ? 85 : 75} // Higher quality for first image
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                                />
                                {showBadge && key === 0 && (
                                    <div className="absolute top-2 left-1 z-10">
                                        <Image
                                            src={badgeUrl}
                                            alt="Badge"
                                            width={60}
                                            height={60}
                                            loading="eager"
                                            priority
                                            quality={90}
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