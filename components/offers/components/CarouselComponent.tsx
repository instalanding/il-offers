import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';

const CarouselComponent: React.FC<{ images: { url: string }[], variantId: string }> = ({ images, variantId }) => {
    const placeholderImages = [
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" }
    ];

    const finalImages = (images && images.length > 0) ? images : placeholderImages;
    
    // Check if the specific variantId is present
    const showBadge = variantId === "41056148652078";
    const badgeUrl = "https://res.cloudinary.com/duslrhgcq/image/upload/v1741422279/b8gtnbw9u7rw5uk0n0pc.png";

    console.log(variantId, "variantId")

    return (
        <div>
            <Carousel>
                <CarouselContent>
                    {finalImages.map((image, key) => (
                        <CarouselItem key={key}>
                            <div className="relative">
                                <Image
                                    alt={"Main Image"}
                                    src={image?.url}
                                    width={480}
                                    height={480}
                                    className="w-full"
                                    priority={key === 0}
                                    loading={key !== 0 ? "lazy" : "eager"}
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
                                />
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