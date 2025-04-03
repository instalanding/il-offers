import React from 'react';
import { FaGift } from 'react-icons/fa';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  label: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  size = 90,
  strokeWidth = 4,
  color,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / max) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`${color}15`}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-mono font-bold" style={{ color }}>
          {value < 10 ? `0${value}` : value}
        </span>
        <span className="text-xs font-medium mt-1 opacity-60" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
};

interface ModernTimerProps {
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
    timer: {
      textColor: string;
      bgColor: string;
    };
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
  };
  style?: React.CSSProperties;
}

const ModernTimer: React.FC<ModernTimerProps> = ({ timeLeft, value, style }) => {
  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!value.specialPrice) return null;
    const original = typeof value.specialPrice.originalPrice === 'string'
      ? parseInt(value.specialPrice.originalPrice)
      : value.specialPrice.originalPrice;
    const offer = typeof value.specialPrice.offerPrice === 'string'
      ? parseInt(value.specialPrice.offerPrice)
      : value.specialPrice.offerPrice;
    const percentage = Math.round(100 - (offer / original) * 100);
    return percentage;
  };

  const discount = calculateDiscount();

  return (
    <div className="w-full relative" style={style}>
      <div className="bg-white rounded-xl">
        {/* Pricing */}
        {(value.specialPrice || value.coupon) && (
          <div className="flex items-center justify-center gap-5">

            {value.specialPrice && (
              <div className='flex items-center gap-3 px-6 pb-4'>
                <span
                  className='text-4xl font-extrabold tracking-tight text-gray-900'
                  style={{
                    color: value.specialPrice.offerPriceColor || '#1F2937',
                  }}
                >
                  ₹{value.specialPrice.offerPrice || '299'}
                </span>
                <span
                  className='text-lg line-through text-gray-400'
                  style={{
                    color: value.specialPrice.originalPriceColor || '#9CA3AF',
                  }}
                >
                  ₹{value.specialPrice.originalPrice || '399'}
                </span>
                {discount && (
                  <span className='text-xs font-semibold px-3 py-1 bg-green-600 text-white rounded-full'>
                    {discount}% OFF
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        {/* Title & Subtitle 1 */}
        {value.title && (
          <h2
            className="text-2xl font-bold text-center mb-4"
            style={{ color: value.titleColor || '#111' }}
          >
            {value.title}
          </h2>
        )}

        {value.subtitle1 && (
          <p
            className="text-sm text-center"
            style={{ color: value.subtitleColor || '#555' }}
          >
            {value.subtitle1}
          </p>
        )}

        {/* Timer Display */}
        <div className="flex items-center justify-center gap-8 my-4">
          <CircularProgress
            value={timeLeft.hours}
            max={24}
            color={value.timer.textColor || '#000'}
            label="Hrs"
          />
          <CircularProgress
            value={timeLeft.minutes}
            max={60}
            color={value.timer.textColor || '#000'}
            label="Mins"
          />
          <CircularProgress
            value={timeLeft.seconds}
            max={60}
            color={value.timer.textColor || '#000'}
            label="Secs"
          />
        </div>

        {/* Subtitle 2 */}
        {value.subtitle2 && (
          <p
            className="text-sm text-center"
            style={{ color: value.subtitleColor || '#555' }}
          >
            {value.subtitle2}
          </p>
        )}

        {/* Coupon */}
        {value.coupon && (
          <div
            className='flex items-center gap-3 px-5 py-2 mt-2 rounded-lg border border-gray-300 bg-white shadow-md'
            style={{ backgroundColor: value.timer.bgColor || '#f3f4f6' }}
          >
            <FaGift
              size={18}
              className='text-gray-700'
              style={{ color: value.coupon.iconColor || '#555' }}
            />
            <span className='text-xs text-gray-500'>No catch, just savings with code</span>

            <span
              className='font-medium text-gray-900 uppercase tracking-wide'
              style={{ color: value.coupon.textColor || '#000' }}
            >
              {value.coupon.code || 'SALE10'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTimer; 