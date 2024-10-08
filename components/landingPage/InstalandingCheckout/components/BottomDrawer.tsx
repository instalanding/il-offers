import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {calculateDiscount} from "@/lib/calculateDiscount";
import Image from "next/image"
import { MdKeyboardArrowRight } from "react-icons/md";
  
const BottomDrawer = ({ schema }: any) => {
    return (
        <Drawer>
            <DrawerTrigger className="bg-white w-full rounded-xl">
                <div className="flex justify-between items-center p-3">
                    <p className="text-sm font-medium">Order summary</p>
                    <MdKeyboardArrowRight />
                </div>
                <div className="bg-white w-full rounded-lg p-2 flex gap-5">
                    <Image
                        alt={`logo`}
                        src={schema.creative.carousel_images[0]}
                        width={50}
                        height={50}
                        className="w-[60px] height-auto object-contain py-3"
                    />
                    <div className="flex flex-col justify-between w-full">
                        <div className="flex flex-col items-start">
                            <p className="text-black text-left font-semibold text-[12px]">{schema.creative.title}</p>
                            <p className="text-black text-[12px] font-medium">Oty: 1</p>
                        </div>
                        <p className="text-black text-[16px] font-medium text-right">{schema.price.offerPrice.prefix}{schema.price.offerPrice.value}</p>
                    </div>
                </div>
            </DrawerTrigger>
            <DrawerContent className="px-3 pb-4">
                <DrawerTitle>Order summary <span className="text-xs font-normal">(1 item)</span></DrawerTitle>
                <div className="bg-white w-full shadow rounded-lg p-2 flex gap-5">
                    <Image
                        alt={`logo`}
                        src={schema.creative.carousel_images[0]}
                        width={50}
                        height={50}
                        className="w-[80px] height-auto object-contain py-3"
                    />
                    <div>
                        <p className="text-gray-500 text-[12px]">{schema.creative.title}</p>
                        <p className="text-black text-[12px] font-medium">Oty: 1</p>
                        <p className="text-black text-[12px] font-medium">{schema.price.offerPrice.prefix}{schema.price.offerPrice.value}</p>
                    </div>
                </div>
                <h2 className="font-semibold text-[14px] mt-2">Bill summary</h2>
                <div className="flex justify-between mt-2">
                    <p className="text-gray-500 text-[12px]">Sub total</p>
                    <p className="text-gray-500 text-[12px]">{schema.price.offerPrice.prefix}{schema.price.offerPrice.value}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-green-700 text-[12px]">Offers and discounts</p>
                    <p className="text-green-700 text-[12px]">- {calculateDiscount(Number(schema.price.offerPrice.value), 10).discountValue}</p>
                </div>
                <div className="flex justify-between border-t mt-3 pt-2">
                    <p className="font-semibold">Total amount</p>
                    <p className="font-semibold text-[14px]">{schema.price.offerPrice.prefix}{calculateDiscount(Number(schema.price.offerPrice.value), 10).discountPrice}</p>
                </div>
            </DrawerContent>
        </Drawer>

    )
}

export default BottomDrawer