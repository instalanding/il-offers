import React from 'react';

interface CapsuleProps {
  label: string;
  value: string;
  isSelected: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  inventory?: number | null;
}

const Capsule: React.FC<CapsuleProps> = ({
  label,
  value,
  isSelected,
  isDisabled = false,
  onClick,
  inventory = null
}) => {
  const isSoldOut = inventory === 0;

  return (
    <>
      {value === "Default Title" ? "" : (<button
        onClick={onClick}
        disabled={isDisabled || isSoldOut}
        className={`
        px-4 py-2 m-1 rounded-lg shadow-lg hover:shadow-xl transition-shadow  border relative text-sm
        ${isSelected
            ? 'border-1 bg-white border-gray-900 text-black hover:bg-gray-100'
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
      </button>)}
    </>
  );
};

export default Capsule; 