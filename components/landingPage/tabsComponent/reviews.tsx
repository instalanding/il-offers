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
      <div
        style={{ boxShadow: "0px 4px 0px 0px #063E0914" }}
        className="flex justify-between items-center relative border my-3 p-4 rounded-2xl "
      >
        <Image
          alt={"Image"}
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
          }
          width={100}
          height={100}
          className="h-[25px] object-contain mt-2"
        />
        <div className="flex items-center gap-3 justify-center">
          <p className="text-[14px] text-center font-normal text-blue-900">
            2,527 ratings
          </p>
          <Rating rating={4} />
        </div>
      </div>
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
