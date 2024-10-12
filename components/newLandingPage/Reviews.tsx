"use client";
import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import axios from "axios";
import Rating from "../landingPage/tabsComponent/rating";
import Image from "next/image";

const Reviews = ({ offer_id }: any) => {
  const [reviews, setReviews] = useState<any>(null);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`api/reviews/?offer_id=${offer_id}`);
      console.log(response.data);
      setReviews(response.data);
    } catch (error: any) {
      console.error("Error saving the offer:", error);
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
        <h1 className="text-[17px]  mx-4 mb-2 font-semibold">
          Reviews
        </h1>
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
      <h1 className="text-[17px] mx-4 mb-2 font-semibold">
        Reviews
      </h1>
      <div className="flex overflow-y-auto px-4 gap-4">
        {reviews.map((m: any) => {
          return <ReviewCard review={m} key={m._id} />;
        })}
      </div>
    </>
  );
};

export default Reviews;
