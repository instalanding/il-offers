import React from 'react'
// import Image from "next/image";
// import { SaveOfferMultipleCta } from '@/components/coupon/SaveOfferMultipleCta';
// import { ShareDialogMultipleCta } from '@/components/coupon/ShareDialogMultipleCta';

const Details = ({ logo, schema, offer_id, userIp }: any) => {
    return (
        <>
            <div className="w-full flex flex-col items-center justify-between gap-2">
                {/* <Image
                    alt={`logo`}
                    src={logo}
                    width={100}
                    height={100}
                    className="w-[100px] h-[100px] object-contain"
                /> */}
                {/* <p className="text-sm text-center font-medium text-gray-500">
                    {schema.store_description}
                </p> */}
            </div>
            {/* <div className="flex justify-center items-center">
                <img
                    src={schema.creative.share_qr}
                    alt=""
                    className="w-[150px]"
                />
            </div> */}
            {/* <h2 className="mt-5 font-semibold">Details</h2> */}
            <div
                className="py-2 text-editor-css"
                dangerouslySetInnerHTML={{
                    __html: schema.creative.terms_and_conditions,
                }}
            >
            </div>
            {/* <div className="flex justify-between mt-auto w-full border-red-600 bottom-0 gap-3">
                <SaveOfferMultipleCta
                    offer_id={offer_id}
                    product_url="multiple-links"
                    data={schema}
                    advertiser_id={schema.advertiser}
                    coupon_code={schema?.creative?.coupon_code}
                    userIp={userIp}
                />
                <ShareDialogMultipleCta
                    shareLink={`https://vri.li/${offer_id}`}
                    offer_id={offer_id}
                />
            </div> */}
        </>
    )
}

export default Details