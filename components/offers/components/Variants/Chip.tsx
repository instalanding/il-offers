import React from "react";

interface ChipProps {
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
    productHandle?: string;
    imageUrl?: string;
    showImage?: boolean;
    showLabel?: boolean;
    customStyle?: {
        fontSize: number;
        backgroundColor: string;
    };
    chipShape?: "circular" | "square";
}

// Helper function to check if a value is a valid color
const isValidColor = (value: string): boolean => {
    // Check for common color names
    const colorNames = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'purple', 'pink', 'brown', 'grey', 'gray'];
    const lowerValue = value.toLowerCase();

    // Check if it's a common color name
    if (colorNames.some(color => lowerValue.includes(color))) return true;

    // Check for hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) return true;

    // Check for rgb/rgba color
    if (/^rgb[a]?\([\d\s,%.]+\)$/.test(value)) return true;

    return false;
};

const Chip: React.FC<ChipProps> = ({
    label,
    value,
    isSelected,
    isDisabled = false,
    onClick,
    inventory,
    imageUrl,
    chipShape,
    showImage,
    showLabel,
    customStyle
}) => {
    const isSoldOut = (inventory !== undefined && inventory !== null && inventory <= 0);
    const isColor = !showImage && isValidColor(value);

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={onClick}
                disabled={isDisabled || isSoldOut}
                className={`
                    relative flex items-center justify-center
                    ${chipShape === "circular" ? "rounded-full" : "rounded-lg"}
                    transition-all duration-200 ease-in-out
                    ${isSelected
                        ? "ring-2 ring-offset-2 ring-black scale-[1.02] shadow-lg"
                        : isSoldOut
                            ? "opacity-50 cursor-not-allowed"
                            : isDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:shadow-md hover:scale-[1.01]"
                    }
                    w-12 h-12 overflow-hidden
                `}
                title={value}
                style={{
                    backgroundColor: isColor
                        ? value.toLowerCase()
                        : (!showImage || !imageUrl)
                            ? customStyle?.backgroundColor || '#e6e6e6'
                            : undefined,
                    border: isColor ? '1px solid #e6e6e6' : undefined
                }}
            >
                {showImage && imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={value}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full" />
                )}
                {isSoldOut && (
                    <div
                        className={`absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center ${chipShape === "circular" ? "rounded-full" : "rounded-lg"
                            }`}
                    >
                        <span className="text-xs font-medium text-red-500">Sold out</span>
                    </div>
                )}
            </button>
            {showLabel && (
                <span className="text-xs font-medium text-center text-wrap max-w-14">
                    {value === "Default Title" ? "" : value.split('|').join('\n')}
                </span>
            )}
        </div>
    );
};

export default Chip;
