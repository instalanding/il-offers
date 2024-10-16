import React from 'react'
import Rating from './rating'

const AverageRatings = ({reviews}) => {
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.review_rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  }

  const averageRating = calculateAverageRating();

  return (
    <div
      style={{ boxShadow: "0px 4px 0px 0px #063E0914" }}
      className="flex justify-between items-center relative border my-3 p-4 rounded-2xl "
    >
      <p className="font-semibold">Ratings</p>
      <div className="flex items-center gap-3 justify-center">
        <p className="text-[14px] text-center font-normal text-blue-900">
          {reviews.length} ratings
        </p>
        <Rating rating={averageRating} />
      </div>
    </div>
  )
}

export default AverageRatings