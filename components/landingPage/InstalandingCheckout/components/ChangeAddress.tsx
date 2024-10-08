import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import Image from "next/image"
import { GrLocation } from "react-icons/gr";
import { MdKeyboardArrowRight } from "react-icons/md";
import { RadioGroup } from "@/components/ui/radio-group";
import AddressBlock from "./AddressBlock";

const ChangeAddress = ({ address, setAddressId, addressId, addresses }: any) => {
    return (
        <Drawer>
            <DrawerTrigger className="bg-white w-full rounded-xl border mt-2">
                <div className="bg-white rounded-xl p-4 cursor-pointer">
                    <div className="flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-3">
                            <GrLocation />
                            <p className="text-[14px]">Deliver to</p>
                        </div>
                        <p className="text-[13px] font-medium">Change</p>
                    </div>
                    <h2 className="text-[13px] font-medium mt-3 text-left">{address?.first_name} {address?.last_name}</h2>
                    <p className="text-[13px] text-gray-500 mt-2 text-left">
                        {address?.address1}, {address?.address2}, {address?.city}, {address?.state} - {address?.pincode}
                    </p>
                </div>
            </DrawerTrigger>
            <DrawerContent className="px-3">
                <DrawerTitle>Select address</DrawerTitle>
                <RadioGroup
                  onValueChange={(value) => setAddressId(value)}
                  value={addressId}
                >
                  {addresses.map((address: any, idx: number) => (
                    <AddressBlock address={address} key={idx} />
                  ))}
                </RadioGroup>
            </DrawerContent>
        </Drawer>

    )
}

export default ChangeAddress