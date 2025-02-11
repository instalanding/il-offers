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
    <button
      onClick={onClick}
      disabled={isDisabled || isSoldOut}
      className={`
        px-4 py-2 m-1 rounded-xl border transition-all relative text-sm
        ${isSelected
          ? 'bg-gray-900 text-white'
          : isSoldOut
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
  );
};

export default Capsule; 