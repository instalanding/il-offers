"use client";
import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import axios from "axios";

const Reviews = ({ productId }: any) => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`api/reviews/?product_id=${productId}`);
      console.log(response.data);
      setReviews(response.data);
    } catch (error: any) {
      console.error("Error saving the offer:", error);
      console.log(error.response.status, "status");
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, []);

  if (!productId) {
    return (
      <>
        <h1 className="text-[13px] text-slate-500 mx-4 mb-2 font-semibold">Reviews</h1>
      </>
    );
  }

  if (reviews.length === 0) {
    return (
      <>
        <h1 className="text-[17px] text-slate-500 mx-4 mb-2 font-semibold">Reviews</h1>
        <div className="flex overflow-y-auto px-4 gap-4">
          <div className="min-w-[250px] rounded-lg h-[160px] bg-[#0000001a]"></div>
          <div className="min-w-[250px] rounded-lg h-[160px] bg-[#0000001a]"></div>
          <div className="min-w-[250px] rounded-lg h-[160px] bg-[#0000001a]"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-[17px] text-slate-500 mx-4 mb-2 font-semibold">Reviews</h1>
      <div className="flex overflow-y-auto px-4 gap-4">
        {reviews.map((m: any) => {
          return <ReviewCard review={m} key={m._id} />;
        })}
      </div>
    </>
  );
};

export default Reviews;
