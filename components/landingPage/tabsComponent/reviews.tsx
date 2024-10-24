import React from "react";
import ReviewCard from "@/components/newLandingPage/ReviewCard";

const Reviews = ({ loading, reviews, schema, offer_id }: any) => {
  if (loading) return <p>Loading...</p>;

  if (reviews.length < 1)
    return <p className="text-center">No reviews found for this product</p>;

  

  return (
    <>
      {/* <AverageRatings reviews={reviews} /> */}
      <h2 className="mt-5 font-semibold">Reviews</h2>
      <div className="flex overflow-y-auto gap-4 pt-2">
        {reviews.map((review: any) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </>
  );
};

export default Reviews;
