import React from "react";

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
}

const Card: React.FC<CardProps> = ({
    value,
    isSelected,
    isDisabled = false,
    onClick,
    priceDetails,
    inventory = null,
}) => {
    const isSoldOut = inventory === 0;

    const originalPrice = priceDetails?.originalPrice?.value;
    const offerPrice = priceDetails?.offerPrice?.value;
    const originalPrefix = priceDetails?.originalPrice?.prefix || "";
    const offerPrefix = priceDetails?.offerPrice?.prefix || "";

    let discountText = "";
    if (originalPrice && offerPrice && parseFloat(originalPrice) > parseFloat(offerPrice)) {
        const discount = ((parseFloat(originalPrice) - parseFloat(offerPrice)) / parseFloat(originalPrice)) * 100;
        discountText = discount > 0 ? `${Math.round(discount)}% Off` : "";
    }

    

    return (
        <button
            onClick={onClick}
            disabled={isDisabled || isSoldOut}
            className={`
                flex flex-col h-auto relative bg-none text-wrap text-sm justify-center
                snap-start flex-shrink-0 border rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer
                ${isSelected
                    ? "border-1 bg-white border-gray-900 text-black hover:bg-gray-100"
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
            <span className="w-full text-center text-xs line-clamp-1">{value}</span>
            <div className="flex flex-col justify-center items-center w-full">
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
        </button>
    );
};

export default Card;