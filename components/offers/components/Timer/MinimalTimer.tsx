import React from 'react';
import { HiOutlineTag } from 'react-icons/hi';

const formatTimeText = (hours: number, minutes: number, seconds: number) => {
  const parts = [];

  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'h' : 'h'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'm' : 'm'}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} s`);

  return parts.join(' : ');
};

interface MinimalTimerProps {
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  value: {
    title?: string;
    titleColor?: string;
    subtitle1?: string;
    subtitle2?: string;
    subtitleColor?: string;
    specialPrice?: {
      offerPrice: number | string;
      originalPrice: number | string;
      offerPriceColor: string;
      originalPriceColor: string;
    };
    coupon?: {
      code: string;
      textColor: string;
      borderColor: string;
      iconColor: string;
    };
    timer: {
      textColor: string;
      bgColor: string;
    };
  };
  style?: React.CSSProperties;
}

const MinimalTimer: React.FC<MinimalTimerProps> = ({ timeLeft, value, style }) => {
  const calculateSavings = () => {
    if (!value.specialPrice) return null;
    return ((value.specialPrice?.originalPrice as number) || 399) - ((value.specialPrice?.offerPrice as number) || 299);
  };

  const savings = calculateSavings();
  const timeText = formatTimeText(timeLeft.hours, timeLeft.minutes, timeLeft.seconds);

  return (
    <div className='w-full relative' style={style}>
      <div className='bg-white rounded-lg'>
        {/* Title */}
        {value.title && (
          <h3 className='text-center font-semibold text-xl text-gray-900 mb-3'>{value.title}</h3>
        )}

        {/* Subtitle 1 */}
        {value.subtitle1 && (
          <p className='text-center text-sm text-gray-600 mb-4'>{value.subtitle1}</p>
        )}

        {/* Price & Discount */}
        {value.specialPrice && (
          <div className='flex items-center justify-center gap-3 mb-2'>
            <span className='text-xl font-bold text-gray-900'>
              ₹{value.specialPrice?.offerPrice || '299'}
            </span>
            <span className='text-sm text-gray-500 line-through'>
              ₹{value.specialPrice?.originalPrice || '399'}
            </span>
            {savings && savings > 0 && (
              <span className='text-xs font-medium px-2 py-1 bg-green-100 text-green-600 rounded'>
                Save ₹{savings}
              </span>
            )}
          </div>
        )}

        {/* Timer */}
        <div
          className='flex justify-between items-center w-full rounded-lg px-4 py-2 mb-4'
          style={{
            backgroundColor: value.timer.bgColor || '#f3f4f6',
            color: value.timer.textColor || '#333',
          }}
        >
          {value.subtitle2 && (
            <p className='text-sm text-gray-600'>{value.subtitle2}</p>
          )}
          <p>{timeText}</p>
        </div>

        {/* Coupon */}
        {value.coupon && (
          <div className='flex justify-center gap-2 items-center'>
            <p className='text-xs'>Use Code</p>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-gray-50'>
              <HiOutlineTag size={18} className='text-gray-500' />
              <span className='text-sm font-medium text-gray-900'>
                {value.coupon.code || 'SALE10'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalTimer; 