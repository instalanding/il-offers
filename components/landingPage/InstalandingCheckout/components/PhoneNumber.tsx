import { Input } from '@/components/ui/input'
import React from 'react'

const PhoneNumber = ({phoneNumber, handleAddPhoneNumber}:any) => {
    return (
        <div className="bg-white w-full rounded-xl p-3 mt-4">
            <h2 className="text-[14px] font-medium">
                ShopLink Checkout
            </h2>
            <p className="text-[12px] text-gray-500 mt-2">
                Enter your phone number to proceed
            </p>
            <div className="mt-3 flex">
                <div className="max-w-[4.5rem] w-full rounded-md rounded-r-none border border-r-0 flex items-center justify-center gap-1">
                    <img
                        src="https://res.cloudinary.com/duslrhgcq/image/upload/v1726027752/pzxg60avup7oru0cx0je.svg"
                        alt=""
                    />
                    <span className="text-sm">+91</span>
                </div>
                <Input
                    value={phoneNumber}
                    className="rounded-l-none"
                    onChange={handleAddPhoneNumber}
                    placeholder="10-digit phone number"
                />
            </div>
        </div>
    )
}

export default PhoneNumber