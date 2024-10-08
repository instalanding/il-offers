import React from 'react'
import { GrLocation } from 'react-icons/gr'
import { IoArrowForwardOutline } from "react-icons/io5";
import { RadioGroupItem } from "@/components/ui/radio-group"


const AddressBlock = ({ address, onClick }: any) => {
    return (
        <div className="bg-white rounded-xl p-4 cursor-pointer mt-2 border" onClick={onClick}>
            <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                    <GrLocation />
                    {/* <p className="text-[14px]">Deliver to</p> */}
                </div>
                <RadioGroupItem value={address.id} id={address.id} />
            </div>
            <h2 className="text-[13px] font-medium mt-3">{address.first_name} {address.last_name}</h2>
            <p className="text-[13px] text-gray-500 mt-2">
                {address.address1}, {address.address2}, {address.city}, {address.state} - {address.pincode}
            </p>
        </div>
    )
}

export default AddressBlock