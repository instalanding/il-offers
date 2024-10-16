import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import Rating from "./rating";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import ReviewCard from "@/components/newLandingPage/ReviewCard";

const Reviews = ({ loading, reviews, schema, offer_id }: any) => {
  if (loading) return <p>Loading...</p>;

  if (reviews.length < 1)
    return <p className="text-center">No reviews found for this product</p>;

  return (
    <>
      <h1 className="font-bold">Customer Reviews</h1>
      <div className="flex items-center gap-3">
        <Rating rating={schema.rating || 5} />
        <p className="text-sm">{schema.rating || 5} out of 5</p>
      </div>
      <h2 className="text-[14px] font-semibold mt-2">Top reviews</h2>
      <div className="flex overflow-y-auto gap-4 pt-2">
        {reviews.map((review: any) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </>
  );
};

export default Reviews;
