import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaUserCircle } from "react-icons/fa";

interface Review {
  userName: string;
  comment: string;
  rating: number;
  date: string;
}

interface StarProps {
  filled: boolean;
  half: boolean;
}

interface ReviewSliderProps {
  reviews: Review[];
  totalStars: number;
  Star: React.FC<StarProps>;
}

const ReviewSlider: React.FC<ReviewSliderProps> = ({ reviews, totalStars, Star }) => {
  return (
    <div className="relative pt-[15%] w-full">
      <Carousel
        style={{ overflow: "visible" }}
        className="mx-auto w-[80%] flex"
      >
        <CarouselContent>
          {reviews.map((review, index) => (
            <CarouselItem key={index}>
              <div className="p-4 bg-white rounded-md border-gray-200 border">
                <div className="flex items-center mb-2">
                  {[...Array(totalStars)].map((_, index) => {
                    const fullStars = Math.floor(review.rating);
                    const hasHalfStar = review.rating % 1 >= 0.5;

                    return (
                      <Star
                        key={index}
                        filled={index < fullStars}
                        half={index === fullStars && hasHalfStar}
                      />
                    );
                  })}
                </div>
                <p className="text-gray-700 mb-2">"{review.comment}"</p>
                <div className="text-sm text-gray-500">
                  <div className="flex gap-2 items-center justify-start">
                    <FaUserCircle size={28} />
                    <div className="flex flex-col">
                      <div>{review.userName}</div>
                      <div>{review.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -top-[15%] flex left-[50%] items-center">
          <CarouselPrevious className="hover:bg-gray-200 left-[-45px] text-gray-600 rounded-lg border border-gray-200" />
          <CarouselNext className="hover:bg-gray-200 left-[5px] text-gray-600 rounded-lg border border-gray-200" />
        </div>
      </Carousel>
    </div>
  );
};

export default ReviewSlider;
