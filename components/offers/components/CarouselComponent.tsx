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
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
                            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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