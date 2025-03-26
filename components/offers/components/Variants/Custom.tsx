import React from "react";

interface CustomProps {
    label: string;
    value: string;
    isSelected: boolean;
    isDisabled?: boolean;
    onClick: () => void;
    inventory?: number | null;
    imageUrl?: string;
    showImage?: boolean;
    showLabel?: boolean;
    labelPlacement?: string;
    customStyle?: {
        fontSize: number;
        backgroundColor: string;
    };
}
const Custom: React.FC<CustomProps> = ({
    label,
    value,
    isSelected,
    isDisabled = false,
    onClick,
    inventory,
    imageUrl,
    showImage,
    showLabel,
    labelPlacement = 'inside',
    customStyle = {
        fontSize: 14,
        backgroundColor: '#e6e6e6'
    }
}) => {
    const isSoldOut = (inventory !== undefined && inventory !== null && inventory <= 0);

    const renderLabel = () => (
        <span
            className='text-center font-medium'
            style={{
                fontSize: `${customStyle.fontSize}px`,
                color: showImage && imageUrl ? 'white' : 'black',
            }}
        >
            {value}
        </span>
    );
    return (

        <div className='flex flex-col gap-2'>
            <button
                onClick={onClick}
                disabled={isDisabled || isSoldOut}
                className={`
          relative flex flex-col items-center justify-center w-full min-h-[120px] p-4
          rounded-lg transition-all duration-200 ease-in-out
          ${isSelected
                        ? 'ring-2 ring-offset-2 ring-black scale-[1.02] shadow-lg'
                        : isSoldOut
                            ? 'opacity-50 cursor-not-allowed'
                            : isDisabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:shadow-md hover:scale-[1.01]'
                    }
        `}
                style={{
                    backgroundColor: !showImage || !imageUrl ? customStyle.backgroundColor : undefined,
                }}
            >
                {/* Background Image */}
                {showImage && imageUrl && (
                    <div className='absolute inset-0 w-full h-full'>
                        <img src={imageUrl} alt={value} className='w-full h-full object-cover rounded-lg' />
                        {/* Overlay for better text visibility */}
                        <div className='absolute inset-0 bg-black bg-opacity-20'></div>
                    </div>
                )}

                {/* Content */}
                <div className='relative z-10 flex flex-col items-center justify-center w-full h-full'>
                    {showLabel && labelPlacement === 'inside' && renderLabel()}
                </div>

                {/* Sold out overlay */}
                {isSoldOut && (
                    <div className='absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg'>
                        <span className='text-sm font-medium text-red-500'>Sold out</span>
                    </div>
                )}
            </button>

            {/* Label below - only show if showLabel is true and labelPlacement is below */}
            {showLabel && labelPlacement === 'below' && (
                <div className='text-center text-black'>{renderLabel()}</div>
            )}
        </div>
    );
};

export default Custom;
