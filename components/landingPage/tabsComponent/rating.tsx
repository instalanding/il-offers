import { FaStar, FaRegStar } from "react-icons/fa";

const Rating = ({ rating, maxRating = 5 }: any) => {
  const fullStars = Math.floor(rating);
  const emptyStars = maxRating - fullStars;

  return (
    <div className="flex">
      {Array(fullStars)
        .fill(0)
        .map((_, index) => (
          <FaStar key={`full_${index}`} className="text-orange-400" />
        ))}
      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <FaRegStar key={`empty_${index}`} className="text-orange-400" />
        ))}
    </div>
  );
};

export default Rating;
