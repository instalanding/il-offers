import React from "react";
import { FaUserCircle } from "react-icons/fa";

interface Review {
    reviewer_name: string;
    review_body_text: string;
    review_rating: number;
    review_date: string;
}

interface StarProps {
  filled: boolean;
  half: boolean;
}

interface ReviewStackProps {
  reviews: Review[];
  totalStars: number;
  Star: React.FC<StarProps>;
}

function processRating(rating: number): { fullStars: number; hasHalfStar: boolean } {
  const clampedRating = Math.max(0, Math.min(5, rating));
  // Round to the nearest 0.5
  const roundedRating = Math.round(clampedRating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 === 0.5;

  return { fullStars, hasHalfStar };
}

const Stack: React.FC<ReviewStackProps> = ({ reviews, totalStars, Star }) => {

  return (
    <div className="flex flex-col gap-2">
      {reviews.map((review, index) => {
        const { fullStars, hasHalfStar } = processRating(review.review_rating);
        return (
          <div
            key={index}
            className="p-4 bg-white rounded-md border-gray-200 border"
          >
            <div className="flex items-center mb-2">
              {[...Array(totalStars)].map((_, index) => (
                <Star
                  key={index}
                  filled={index < fullStars}
                  half={index === fullStars && hasHalfStar}
                />
              ))}
            </div>
            <p className="text-gray-700 mb-2">&quot;{review.review_body_text
            }&quot;</p>
            <div className="text-sm text-gray-500">
              <div className="flex gap-2 items-center justify-start">
                <FaUserCircle size={28} />
                <div className="flex flex-col">
                  <div>{review.reviewer_name}</div>
                  <div>{review.review_date
                  }</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stack;