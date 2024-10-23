
import Image from 'next/image'
import React from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { LiaCreditCardSolid } from "react-icons/lia";
import { BsBank } from "react-icons/bs";
import { IoWalletOutline } from "react-icons/io5";

const PaymentMethods = ({finalPrice, codCharge, offer_id, address, userId, phoneNumber}:any) => {
    const paymentDetails = {
        customer_id: userId.toString(),
        customer_phone: phoneNumber,
        customer_name: `${address.first_name} ${address.last_name}`,
        customer_email: address.email,
        amount: finalPrice
    }
    return (
        <div className="mt-3">
            <h2 className="text-[13px] font-medium">Payment methods</h2>
            {/* <div className="bg-white w-full rounded-xl p-3 mt-3 flex items-center justify-between cursor-pointer border" onClick={(e)=>handlePayment(e, paymentDetails, offer_id)}>
                <div className="flex gap-2">
                    <Image
                        src="https://res.cloudinary.com/duslrhgcq/image/upload/v1726823276/bvfu5fjrxwf7f5lgpbul.png"
                        alt="logo"
                        width={30}
                        height={30}
                        className="object-contain"
                    ></Image>
                    <div>
                        <h3 className="text-[13px] font-semibold">Pay via UPI</h3>
                        <p className="text-gray-400 text-[12px]">Avoid COD Charges!</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-gray-600">₹{finalPrice}</h3>
                    <MdKeyboardArrowRight />
                </div>
            </div> */}
            <div className="bg-white w-full rounded-xl p-3 mt-3 flex items-center justify-between cursor-pointer border">
                <div className="flex gap-2 items-center">
                <IoWalletOutline  size={23}/>
                    <div>
                        <h3 className="text-[13px] font-semibold">Cash on delivery</h3>
                        <p className="text-gray-400 text-[12px]">Pay with cash</p>
                        <p className="text-[12px] bg-gray-100 px-1 rounded-md">Includes ₹{codCharge} COD fee</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-semibold text-gray-600">₹{Number(finalPrice) + Number(codCharge)}</h3>
                    <MdKeyboardArrowRight />
                </div>
            </div>
            {/* <div className="bg-white w-full rounded-xl p-3 mt-3 flex items-center justify-between cursor-pointer border" onClick={(e)=>handlePayment(e, paymentDetails, offer_id)}>
                <div className="flex gap-2 items-center">
                <LiaCreditCardSolid  size={23}/>
                    <div>
                        <h3 className="text-[13px] font-semibold">Debit/Credit cards</h3>
                        <p className="text-gray-400 text-[12px]">Avoid COD Charges!</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-gray-600">₹{finalPrice}</h3>
                    <MdKeyboardArrowRight />
                </div>
            </div> */}
            {/* <div className="bg-white w-full rounded-xl p-3 mt-3 flex items-center justify-between cursor-pointer border" onClick={(e)=>handlePayment(e, paymentDetails, offer_id)}>
                <div className="flex gap-2 items-center">
                <BsBank  size={20}/>
                    <div>
                        <h3 className="text-[13px] font-semibold">Netbanking</h3>
                        <p className="text-gray-400 text-[12px]">Avoid COD Charges!</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-gray-600">₹{finalPrice}</h3>
                    <MdKeyboardArrowRight />
                </div>
            </div> */}
        </div>
    )
}

export default PaymentMethods