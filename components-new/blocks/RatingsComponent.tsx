import React from 'react';
import { BsStarFill } from "react-icons/bs";
import { MdVerified } from 'react-icons/md';

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

    return (
        <div style={style} className='flex flex-col'>
            <h3 className='text-lg font-medium'>{value.title}</h3>
            <p className='text-sm font-light'>{value.subtitle}</p>
            <div className='flex items-center'>
                <div className='flex gap-2 items-center mr-2 w-auto bg-green-600 rounded-md py-[2px] px-2 text-white'>
                    <BsStarFill />
                    {value.rating ? value.rating : ''}
                </div>
                {value.totalReviews ? (
                    <div className='flex justify-start items-center gap-1'>
                        |
                        <MdVerified size={18} className='text-blue-600' />
                        {`${value.totalReviews} Verified Reviews`}
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default RatingsComponent;