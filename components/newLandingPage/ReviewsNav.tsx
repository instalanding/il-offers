import axios from "axios";
import React, { useEffect, useState } from "react";
import Rating from "../landingPage/tabsComponent/rating";

const ReviewsNav = ({ product_handle }: any) => {
  const [reviewCount, setReviewCount] = useState<any>(null);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}reviews/?shopify_product_handle=${product_handle}`
      );
      setReviewCount(data.totalReviews);
      console.log(data);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      console.log(error.response.status, "status");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (!reviewCount) {
    return <></>;
  }

  return (
    <div className="px-3 mt-3">
      <div className="flex items-center gap-2 text-center">
        <Rating rating={4} />
        <p className="text-[14px] text-center font-normal text-black">
          ({reviewCount} ratings)
        </p>
      </div>
    </div>
  );
};

export default ReviewsNav;
