import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import Rating from "./rating";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

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

      {reviews.map((review: any) => (
        <div className="mt-2" key={review._id}>
          <div className="flex items-center gap-2">
            <div className="w-[2rem] h-[2rem] border rounded-full flex items-center justify-center">
              <FaRegCircleUser className="text-gray-400" />
            </div>
            <p className="text-[14px] font-semibold">{review.reviewer_name}</p>
          </div>
          <Rating rating={review.review_rating} />
          {review.review_date && (
            <p className="text-[13px] text-gray-500 py-1">
              {new Date(review.review_date).toLocaleDateString()}
            </p>
          )}
          <p className="text-[13px]">{review.review_body_text}</p>
          {review.review_media &&
            review.review_media.photos &&
            review.review_media.photos.length > 0 && (
              <div className="mt-2">
              
                <Image
                  src={review.review_media.photos[0]}
                  alt="Review image"
                  width={100}
                  height={100}
                  className="rounded-md"
                />
              </div>
            )}
        </div>
      ))}
    </>
  );
};

export default Reviews;
