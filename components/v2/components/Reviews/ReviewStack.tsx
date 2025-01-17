import React from "react";
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

interface ReviewStackProps {
  reviews: Review[];
  totalStars: number;
  Star: React.FC<StarProps>;
}

const ReviewStack: React.FC<ReviewStackProps> = ({ reviews, totalStars, Star }) => {
  return (
    <div className="flex flex-col gap-4 pt-4">
      {reviews.map((review, index) => (
        <div
          key={index}
          className="p-4 bg-white rounded-md border-gray-200 border"
        >
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
      ))}
    </div>
  );
};

export default ReviewStack;
