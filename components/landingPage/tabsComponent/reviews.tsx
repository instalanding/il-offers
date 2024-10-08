import React from 'react'
import { FaRegCircleUser } from "react-icons/fa6";
import Rating from './rating';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Reviews = ({ loading, reviews, schema, offer_id }: any) => {

  function extractRating(sentence: string) {
    const regex = /(\d+(\.\d+)?)\s+out of\s+(\d+(\.\d+)?)\s+stars/i;
    const match = sentence.match(regex);
    return match ? parseFloat(match[1]) : null;
  }
  return (
    <>
      <h1 className="font-bold">Amazon reviews</h1>
      <div className="flex items-center gap-3">
        <Rating rating={4} />
        <p className="text-sm">4 out of 5</p>
      </div>
      <h2 className="text-[14px] font-semibold mt-2">Top positive reviews</h2>
      {
        loading ? <p>Loading...</p> :
          <>
            {
              reviews.length < 1 ? <p>No reviews found for this product</p> : reviews.map((review: any) => (
                <div className="mt-2" key={review._id}>
                  <div className="flex items-center gap-2">
                    <div className="w-[2rem] h-[2rem] border rounded-full flex items-center justify-center">
                      <FaRegCircleUser className="text-gray-400" />
                    </div>
                    <p className="text-[14px] font-semibold">{review.profile_name}</p>
                  </div>
                  <Rating rating={extractRating(review.review_rating)} />
                  <p className="text-[13px] text-gray-500 py-1">{review.review_date}</p>
                  <p className="text-[13px]">{review.review_body}
                  </p>
                </div>
              ))
            }
          </>
      }
      <Link
        key={schema.buttons[0]}
        href={`https://links.instalanding.in/redirect/?offer_id=${offer_id}&advertiser_id=${schema.advertiser}&tags=${schema?.tags}&redirect_url=${schema.buttons[0].url}&ctatype=${schema.buttons[0].type}`}
        target="_blank"
      >
        <Button className="bg-orange-400 w-full mt-5 hover:bg-orange-600">More Reviews on Amazon</Button>
      </Link>
    </>
  )
}

export default Reviews