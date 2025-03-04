import React from "react";
import { FaStar, FaFireAlt } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
interface CardProps {
    label: string;
    value: string;
    isSelected: boolean;
    isDisabled?: boolean;
    onClick: () => void;
    priceDetails?: {
        originalPrice?: { value: string; prefix?: string };
        offerPrice?: { value: string; prefix?: string };
    };
    inventory?: number | null;
    greatDeal: boolean;
    mostLoved: boolean;
}

const Card: React.FC<CardProps> = ({
    value,
    isSelected,
    isDisabled = false,
    onClick,
    priceDetails,
    inventory = null,
    greatDeal,
    mostLoved
}) => {

    const isSoldOut = inventory !== null && inventory === 0;
    const originalPrice = priceDetails?.originalPrice?.value;
    const offerPrice = priceDetails?.offerPrice?.value;
    const originalPrefix = priceDetails?.originalPrice?.prefix || "";
    const offerPrefix = priceDetails?.offerPrice?.prefix || "";

    let discountText = "";
    if (originalPrice && offerPrice && parseFloat(originalPrice) > parseFloat(offerPrice)) {
        const discount = ((parseFloat(originalPrice) - parseFloat(offerPrice)) / parseFloat(originalPrice)) * 100;
        discountText = discount > 0 ? `${Math.round(discount)}% Off` : "";
    }

    // hardcoded: for cureveda we have to show recommended tag for results pack and disable other tags
    const recommended = value.toLowerCase().includes("results pack");
    const noTags = value.toLowerCase().includes("results pack") || value.toLowerCase().includes("starter pack") || value.toLowerCase().includes("value pack");

    return (
        <div className="flex flex-col gap-1">
            <button
                onClick={onClick}
                disabled={isDisabled || isSoldOut}
                className={`
                flex flex-col h-full relative bg-none text-sm justify-center
                snap-start flex-shrink-0 border rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer
                ${isSelected
                        ? greatDeal && !noTags
                            ? "border-1 border-[#546327] bg-white text-black hover:bg-gray-100"
                            : recommended
                                ? "border-1 border-[#546327] bg-white text-black hover:bg-gray-100"
                                : "border-1 bg-white border-gray-900 text-black hover:bg-gray-100"
                        : isSoldOut
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : isDisabled
                                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-black hover:bg-gray-100"
                    }
            `}
            >
                {isSoldOut && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Sold Out
                    </span>
                )}
                <span className="pt-2 w-full text-center text-xs whitespace-pre-line break-words">
                    {value === "Default Title" ? "" : value.split('|').join('\n')}
                </span>
                <div className="pb-2 flex flex-col justify-center items-center w-full">
                    {originalPrice || offerPrice ? (
                        <div className="mt-1 flex flex-col-reverse justify-center items-center">
                            {offerPrice ? (
                                <span className={`text-lg font-semibold ${isSoldOut ? 'text-gray-400' : 'text-gray-800'}`}>
                                    {offerPrefix}{offerPrice}
                                </span>
                            ) : (
                                <span className={`text-lg ${isSoldOut ? 'text-gray-300' : 'text-gray-800'}`}>
                                    {originalPrefix}{originalPrice}
                                </span>
                            )}

                            {originalPrice && offerPrice && parseFloat(originalPrice) > parseFloat(offerPrice) && (
                                <span className={`text-xs line-through ${isSoldOut ? 'text-gray-400' : 'text-gray-400'}`}>
                                    {originalPrefix}{originalPrice}
                                </span>
                            )}
                        </div>
                    ) : null}

                    {discountText && (
                        <p className={` text-xs mt-1 ${isSoldOut ? 'text-red-300' : 'text-red-600'}`}>
                            {discountText}
                        </p>
                    )}
                </div>
                <>
                    {greatDeal && !noTags && (
                        <div className="flex gap-1 items-center justify-center w-full bg-[#546327] text-white text-xs font-normal px-2 py-[2px] rounded-b-sm shadow-md ">
                            <RiMoneyRupeeCircleFill size={14} color="#EC8A1A" /> Best Deal
                        </div>
                    )}
                    {recommended && (
                        <div className="flex gap-1 items-center justify-center w-full bg-[#546327] text-white text-xs font-normal px-2 py-[2px] rounded-b-sm shadow-md">
                            <FaStar color="#EC8A1A" /> Recommended
                        </div>
                    )}
                </>
            </button>
            {/* {mostLoved && !noTags && (
                // <div className="flex gap-1 items-center justify-center w-full bg-red-600 text-white text-xs font-normal px-2 py-0.5 rounded-sm shadow-md">
                //     <IoHeartCircle size={14} /> Most Loved
                // </div>
                <div className="flex gap-1 items-center justify-center w-full bg-[#F7D1DB] text-[#FD4D77] text-xs font-normal px-2 py-0.5 rounded-sm shadow-md">
                    <IoHeartCircle size={16} color="#FD4D77" /> Most Loved
                </div>
            )} */}

        </div >
    );
};

export default Card;