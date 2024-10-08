import React from "react";
import Rating from "../landingPage/tabsComponent/rating";
import ProfileCard from "./ProfileCard";

const ReviewCard = ({ review }: any) => {
  function extractRating(sentence: string) {
    const regex = /(\d+(\.\d+)?)\s+out of\s+(\d+(\.\d+)?)\s+stars/i;
    const match = sentence.match(regex);
    return match ? parseFloat(match[1]) : null;
  }
  return (
    <div className="border min-w-[250px] p-3 rounded-xl space-y-2">
      <ProfileCard name={review.profile_name} date={review.review_date} />
      <Rating rating={extractRating(review.review_rating)} />
      <div>
        <p className="text-[15px] tracking-wider line-clamp-5 text-[#0000008a]">
          {review.review_body}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
