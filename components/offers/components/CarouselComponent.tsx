'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';

interface CarouselProps {
    images: {
        id: number;
        variant_ids: number[];
        url: string;
    }[];
    variantId: string;
}

const CarouselComponent: React.FC<CarouselProps> = ({ images, variantId }) => {
    // Memoize placeholder images to avoid recreating on each render
    const placeholderImages = useMemo(() => [
        { id: 0, variant_ids: [], url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { id: 1, variant_ids: [], url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" },
        { id: 2, variant_ids: [], url: "https://res.cloudinary.com/duslrhgcq/image/upload/v1737708332/nzmwfrmho2jzdjyay3ie.webp" }
    ], []);

    // Memoize finalImages to avoid recreating array on each render
    const finalImages = useMemo(() =>
        (images && images.length > 0) ? images : placeholderImages,
        [images, placeholderImages]
    );

    // Find the index of the image that contains the current variant ID
    const initialSlide = useMemo(() => {
        const variantIdNumber = parseInt(variantId);
        const index = finalImages.findIndex(img => img.variant_ids?.includes(variantIdNumber));
        return index >= 0 ? index : 0;
    }, [finalImages, variantId]);

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
    const carouselItems = useMemo(() => (
        // finalImages.map((image, index) => (
            // <CarouselItem key={`carousel-item-${index}-${image.url}`}>
                <div className="relative">
                    <Image
                        src={finalImages[0]?.url}
                        alt="Main Product Image"
                        width={480}
                        height={480}
                        className="main-product-image w-full h-auto max-w-full object-contain"
                        priority={true}
                        quality={90}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyVC08MTY3LjIyOUFTRjo/Tj4yMkhiSk46NjU+QVZFRkpLUlNWW1b/2wBDARUXFx4aHjshITtBNkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        loading="eager"
                        decoding="sync"
                        fetchPriority="high"
                    />
                </div>
            // </CarouselItem>
        // )),
    ), [finalImages]);

    return (
        <div className="carousel-wrapper">
            {/* <Carousel opts={{ startIndex: initialSlide }}>
                <CarouselContent> */}
                    {carouselItems}
                {/* </CarouselContent>
                <CarouselPrevious className="left-[7px] shadow-md" />
                <CarouselNext className="right-[7px] shadow-md" />
            </Carousel> */}
        </div>
    );
};

// Use memo to prevent unnecessary rerenders of the entire carousel
export default React.memo(CarouselComponent);