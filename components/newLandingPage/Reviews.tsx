"use client";
import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import axios from "axios";
import Rating from "../landingPage/tabsComponent/rating";
import Image from "next/image";

const Reviews = ({ product_handle }: any) => {
  const [reviews, setReviews] = useState<any>(null);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`api/reviews/?shopify_product_handle=${product_handle}`);
      console.log(response.data);
      // Sort reviews by date in descending order and limit to 5
      const sortedReviews = response.data
        .sort(
          (a: any, b: any) =>
            new Date(b.review_date).getTime() -
            new Date(a.review_date).getTime()
        )
        .slice(0, 5);
      setReviews(sortedReviews);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      console.log(error.response.status, "status");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (!reviews) {
    return (
      <>
        <div
          style={{ boxShadow: "0px 4px 0px 0px #063E0914" }}
          className="flex justify-between items-center relative border m-3 p-4 rounded-2xl "
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
        <h1 className="text-[17px]  mx-4 mb-2 font-semibold">Reviews</h1>
        <div className="flex overflow-y-auto px-4 gap-4">
          <div className="min-w-[250px] rounded-lg h-[160px] bg-[#0000001a]"></div>
          <div className="min-w-[250px] rounded-lg h-[160px] bg-[#0000001a]"></div>
          <div className="min-w-[250px] rounded-lg h-[160px] bg-[#0000001a]"></div>
        </div>
      </>
    );
  }

  if (reviews.length === 0) {
    return <></>;
  }

  return (
    <>
      <div
        style={{ boxShadow: "0px 4px 0px 0px #063E0914" }}
        className="flex justify-between items-center relative border m-3 p-4 rounded-2xl "
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
      <h1 className="text-[17px] mx-4 mb-2 font-semibold">Reviews</h1>
      <div className="flex overflow-y-auto px-4 gap-4">
        {reviews.map((m: any) => {
          return <ReviewCard review={m} key={m._id} />;
        })}
      </div>
    </>
  );
};

export default Reviews;
