import React from "react";

const fakeVariantsData = [
    {
        label: "100ml",
        price: 235,
        originalPrice: 269,
        discount: "13% off",
    },
    {
        label: "200ml",
        price: 430,
        originalPrice: 499,
        discount: "14% off",
    },
];

const VariantsCarousel = ({ variants = fakeVariantsData }) => {
    return (
        <div className="w-full bg-white">
            <div className="flex flex-wrap gap-4">
                {variants.map((variant, index) => (
                    <div
                        key={index}
                        className="snap-start flex-shrink-0 w-[180px] border rounded-lg p-3 shadow-sm"
                    >
                        <p className="text-sm font-medium">{variant.label}</p>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-xl font-semibold text-gray-800">
                                ₹{variant.price}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                                ₹{variant.originalPrice}
                            </span>
                        </div>
                        <p className="text-red-500 text-sm font-medium mt-1">
                            {variant.discount}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VariantsCarousel;