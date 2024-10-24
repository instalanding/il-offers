"use client";
import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import axios from "axios";
import Rating from "../landingPage/tabsComponent/rating";

const Reviews = ({ product_handle }: any) => {
  const [reviews, setReviews] = useState<any>(null);
  const [reviewCount, setReviewCount] = useState<any>(null);

const fetchReviews = async () => {
  try {
    const response = await axios.get(`${window.location.origin}/api/reviews/?shopify_product_handle=${product_handle}`);
    console.log(response.data, "response.data");

    const uniqueReviewerNames = new Set();
    const uniqueReviews = [];

    // Sort reviews by date in descending order
    const sortedReviews = response.data.sort(
      (a: any, b: any) =>
        new Date(b.review_date).getTime() - new Date(a.review_date).getTime()
    );

    // Filter for unique reviewer names and limit to 5
    for (const review of sortedReviews) {
      if (!uniqueReviewerNames.has(review.reviewer_name) && uniqueReviews.length < 5) {
        uniqueReviewerNames.add(review.reviewer_name);
        uniqueReviews.push(review);
      }
    }

    setReviews(uniqueReviews);
    setReviewCount(response.data.length); // This still sets the total review count
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
        {/* <div
          style={{ boxShadow: "0px 4px 0px 0px #063E0914" }}
          className="flex justify-center items-center relative border m-3 p-4 rounded-2xl "
        >
          
          <div className="flex items-center gap-3 justify-center">
            <p className="text-[14px] text-center font-normal text-blue-900">
              2,527 ratings
            </p>
            <Rating rating={4} />
          </div>
        </div> */}
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
        className="flex justify-center items-center relative border m-3 p-4 rounded-2xl "
      >
        <div className="flex items-center gap-3 justify-center text-center">
          <Rating rating={4} />
          <p className="text-[14px] text-center font-normal text-black">
            ({reviewCount} ratings)
          </p>
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
