import React from 'react'
import { FaRegCircleUser } from "react-icons/fa6";
import Rating from './rating';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const Reviews = ({ loading, reviews, schema, offer_id }: any) => {
  return (
    <>
      <h1 className="font-bold">Customer Reviews</h1>
      <div className="flex items-center gap-3">
        <Rating rating={schema.rating || 5} />
        <p className="text-sm">{schema.rating || 5} out of 5</p>
      </div>
      <h2 className="text-[14px] font-semibold mt-2">Top reviews</h2>
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
                    <p className="text-[14px] font-semibold">{review.reviewer_name}</p>
                  </div>
                  <Rating rating={review.review_rating} />
                  <p className="text-[13px] text-gray-500 py-1">{new Date(review.review_date).toLocaleDateString()}</p>
                  <p className="text-[13px]">{review.review_body_text}</p>
                  {review.review_media && review.review_media.photos && review.review_media.photos.length > 0 && (
                    <div className="mt-2">
                      <Image
                        src={review.review_media.photos[0]}
                        alt="Review image"
                        width={100}
                        height={100}
                        className="rounded-md"
                      />
                    </div>
                  )}
                </div>
              ))
            }
          </>
      }
      {/* <Link
        href={`https://links.instalanding.in/redirect/?offer_id=${offer_id}&advertiser_id=${schema.advertiser}&tags=${schema?.tags}&redirect_url=${schema.buttons[0].url}&ctatype=${schema.buttons[0].type}`}
        target="_blank"
      >
        <Button className="bg-orange-400 w-full mt-5 hover:bg-orange-600">More Reviews on Amazon</Button>
      </Link> */}
    </>
  )
}

export default Reviews