import React from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import createGradient from '@/lib/createGradient'

const ProductCard = ({ campaign }: any) => {
    return (
        <div className="rounded-md p-2 flex items-center flex-col justify-center card shadow-md" style={{ backgroundImage: createGradient(campaign?.config?.button1Color) }}>
            <h1 className="text-l font-medium py-3">🎁 {campaign?.creative?.title}</h1>
            <Image
                src={campaign.creative?.image}
                alt='zivame creative'
                width={250}
                height={250}
                className='min-w-[250px] h-[250px] mt-3 rounded-md'
            />
            <div className='flex justify-between w-full mt-4'>
                <h2 className='text-sm'>{campaign?.creative?.text}<span className='text-green-500 font-medium'>{campaign?.price?.offerPrice.prefix}{campaign?.price?.offerPrice.value}</span></h2>
                <h2 className='text-sm line-through font-medium'>{campaign?.price?.originalPrice.prefix}{campaign?.price?.originalPrice.value}</h2>
            </div>
            <div className='flex gap-2 justify-between mt-2 w-full items-center'>
                <Button variant="outline" className={`text-xs w-1/2`} >{campaign.config?.button2Text}</Button>
                <Button
                    style={{ backgroundColor: campaign?.config?.button1Color }}
                    className="hover:shadow-md"
                >
                    {campaign?.config?.button1Text}
                </Button>
            </div>
            <div className="border w-full bg-white py-2 rounded-md mt-3">
                <h3 className={`text-center text-sm text-[${campaign?.config?.button1Color}] font-semibold`}>Use Code</h3>
                <h3 className={`text-center text-sm text-[${campaign?.config?.button1Color}] font-semibold`}>{campaign?.creative?.coupon_code}</h3>
            </div>
        </div>
    )
}

export default ProductCard
