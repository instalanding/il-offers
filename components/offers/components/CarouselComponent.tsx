import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from 'next/image';

const CarouselComponent: React.FC<{ images: { url: string }[] }> = ({ images }) => {
    const placeholderImages = [
        { url: "https://via.placeholder.com/480?text=Add+image+1" },
        { url: "https://via.placeholder.com/480?text=Add+image+2" },
        { url: "https://via.placeholder.com/480?text=Add+image+3" }
    ];

    const finalImages = (images && images.length > 0) ? images : placeholderImages;

    return (
        <div>
            <Carousel>
                <CarouselContent>
                    {finalImages.map((image, key) => (
                        <CarouselItem key={key}>
                            <Image
                                alt={"Main Image"}
                                src={image?.url}
                                width={480}
                                height={480}
                                className="w-full"
                                priority={key === 0}
                                loading={key !== 0 ? "lazy" : "eager"}
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