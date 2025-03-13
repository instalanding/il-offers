import React from 'react';

interface CapsuleProps {
  label: string;
  value: string;
  isSelected: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  inventory?: number | null | undefined;
  productHandle?: string;
}

const Capsule: React.FC<CapsuleProps> = ({
  label,
  value,
  isSelected,
  isDisabled = false,
  onClick,
  inventory = null,
  productHandle
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
            px-4 py-2 m-1 rounded-lg shadow-lg hover:shadow-xl transition-shadow border relative text-sm
            ${isSelected
              ? isCureveda 
                ? 'border-1 border-[#E7A023] bg-[#FBE9CA] text-black hover:bg-[#f8e2b8]'
                : 'border-1 bg-white border-gray-900 text-black hover:bg-gray-100'
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
          {value}
        </button>
      )}
    </>
  );
};

export default Capsule; 