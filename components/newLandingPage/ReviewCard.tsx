import React from "react";
import Rating from "../landingPage/tabsComponent/rating";
import ProfileCard from "./ProfileCard";
import Image from "next/image";

interface Review {
  review_body_text: string;
  review_rating: number;
  review_date: string;
  reviewer_name: string;
  review_media?: {
    photos?: string[];
  };
}

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="border min-w-[250px] p-3 rounded-xl space-y-2">
      <ProfileCard
        name={review.reviewer_name}
        date={review.review_date ? new Date(review.review_date).toLocaleDateString() : ""}
      />
      <Rating rating={review.review_rating} />
      <div>
        <p className="text-[13px] line-clamp-5 text-[#020817]">
          {review.review_body_text}
        </p>
      </div>
      {review.review_media?.photos && review.review_media.photos.length > 0 && (
        <div className="mt-2">
          <Image
            src={review.review_media.photos[0]}
            alt="Review image"
            width={200}
            height={200}
            className="rounded-md object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
