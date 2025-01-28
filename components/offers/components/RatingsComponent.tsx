import React from 'react';
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

interface RatingsComponentProps {
    value: {
        rating: number;
        title: string;
        subtitle: string;
        totalReviews: number;
    },
    style?: React.CSSProperties;
}

const RatingsComponent: React.FC<RatingsComponentProps> = ({ value, style }) => {
    const totalStars = 5;
    const fullStars = Math.floor(value.rating);
    const hasHalfStar = value.rating % 1 >= 0.5;

    return (
        <div style={style} className="flex flex-col">
            <h3 className="text-lg font-medium">{value.title}</h3>
            <p className="text-sm font-light mb-2">{value.subtitle}</p>
            <div className="flex items-center">
                {[...Array(totalStars)].map((_, index) => (
                    <Star
                        key={index}
                        filled={index < fullStars}
                        half={index === fullStars && hasHalfStar}
                    />
                ))}
                <span className="ml-2 text-sm">
                    {value.rating} ({value.totalReviews} reviews)
                </span>
            </div>
        </div>
    );
};

interface StarProps {
    filled: boolean;
    half: boolean;
}

const Star: React.FC<StarProps> = ({ filled, half }) => (
    <span className="text-xl text-yellow-500">
        {filled ? <BsStarFill /> : half ? <BsStarHalf /> : <BsStar />}
    </span>
);

export default RatingsComponent;