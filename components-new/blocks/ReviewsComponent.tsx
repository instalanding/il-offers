import React from "react";
import Slider from "./reviews/Slider";
import Stack from "./reviews/Stack";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

interface RatingsComponentProps {
    value: {
        reviewType: string;
        reviews: Array<{
            reviewer_name: string;
            review_body_text: string;
            review_rating: number;
            review_date: string;
        }>;
        title: string;
        subtitle: string;
        topReviewsCount: number;
    };
    style?: React.CSSProperties;
}

interface StarProps {
    filled: boolean;
    half: boolean;
}

const ReviewsComponent: React.FC<RatingsComponentProps> = ({ value, style }) => {

    const reviews = value.reviews.slice(0, value.topReviewsCount);
    const totalStars = 5;

    return (
        <div style={{ ...style, overflow: "visible" }} className="flex flex-col gap-1">
            <h3 className="text-lg text-center font-medium">{value.title}</h3>
            <p className="text-sm text-center font-light">{value.subtitle}</p>

            {value.reviewType === "slider" ? (
                <Slider reviews={reviews} totalStars={totalStars} Star={Star} />
            ) : value.reviewType === "stack" ? (
                <Stack reviews={reviews} totalStars={totalStars} Star={Star} />
            ) : null}
        </div>
    );
};

const Star: React.FC<StarProps> = ({ filled, half }) => (
    <span className="text-lg text-yellow-500">
        {filled ? <BsStarFill /> : half ? <BsStarHalf /> : <BsStar />}
    </span>
);

export default ReviewsComponent;