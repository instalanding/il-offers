import React from 'react';

interface CapsuleProps {
  label: string;
  value: string;
  isSelected: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  inventory?: number | null | undefined;
  productHandle?: string;
  imageUrl?: string;
  showImage?: boolean;
}

const Capsule: React.FC<CapsuleProps> = ({
  label,
  value,
  isSelected,
  isDisabled = false,
  onClick,
  inventory = null,
  productHandle,
  imageUrl,
  showImage = false,
}) => {
  const isSoldOut = inventory !== null && inventory === 0;
  const isCureveda = productHandle === "cureveda-pro-vegan-plant-protein";

  return (
    <>
      {value === "Default Title" ? "" : (
        <button
          onClick={onClick}
          disabled={isDisabled || isSoldOut}
          className={`
            ${showImage ? 'px-2 py-1' : 'px-4 py-2'
            }  m-1 rounded-lg shadow-lg hover:shadow-xl transition-shadow border relative text-sm
            
            ${isSelected
              ? isCureveda
                ? 'border-1 border-[#E7A023] bg-[#FBE9CA] text-black hover:bg-[#f8e2b8]'
                // : 'border-1 bg-white border-gray-900 text-black hover:bg-gray-100'
                : 'ring-2 ring-offset-2 ring-black scale-[1.02] shadow-lg'
              : isSoldOut
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isDisabled
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-100'
            }
          `}
        >
          {isSoldOut && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              Sold Out
            </span>
          )}
          <div className='flex flex-wrap items-center gap-2'>
            {showImage && imageUrl && (
              <div className='w-7 h-7 rounded-full overflow-hidden flex-shrink-0'>
                <img src={imageUrl} alt={value} className='w-full h-full object-cover' />
              </div>
            )}
            <span>{value}</span>
          </div>
        </button>
      )}
    </>
  );
};

export default Capsule;