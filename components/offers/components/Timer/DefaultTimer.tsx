import React from 'react';
import { FaTag } from 'react-icons/fa';

interface TimeUnitProps {
  value: string;
  label: string;
  bgColor: string;
  textColor: string;
  subtitleColor: string;
}

const TimeUnit: React.FC<TimeUnitProps> = ({
  value,
  label,
  bgColor,
  textColor,
  subtitleColor,
}) => (
  <div className="flex flex-col items-center">
    <div
      className="text-center px-4 py-3 rounded-lg font-mono text-2xl min-w-[2rem] shadow-sm"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {value}
    </div>
    <span
      className="text-sm mt-2 font-medium uppercase tracking-wider"
      style={{ color: subtitleColor }}
    >
      {label}
    </span>
  </div>
);

interface DefaultTimerProps {
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  formatTime: (time: number) => string;
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
      offerPrice: any;
      originalPrice: any;
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

const DefaultTimer: React.FC<DefaultTimerProps> = ({ timeLeft, formatTime, value, style }) => {
  return (
    <div className="w-full relative" style={style}>
      <div className="bg-white rounded-lg">
        {/* Title & Subtitles */}
        {value.title && (
          <h3
            className="text-center font-bold text-2xl mb-4"
            style={{ color: value.titleColor || '#000' }}
          >
            {value.title}
          </h3>
        )}

        {value.subtitle1 && (
          <p
            className="text-center text-sm"
            style={{ color: value.subtitleColor || '#555' }}
          >
            {value.subtitle1}
          </p>
        )}

        {/* Timer Display */}
        <div className="flex items-center justify-center gap-4 my-4">
          <TimeUnit
            value={formatTime(timeLeft.hours)}
            label="Hours"
            bgColor={value.timer.bgColor || '#f3f4f6'}
            textColor={value.timer.textColor || '#000'}
            subtitleColor={value.subtitleColor || '#777'}
          />

          <span
            className="text-2xl font-bold mb-8"
            style={{ color: value.timer.textColor || '#000' }}
          >
            :
          </span>

          <TimeUnit
            value={formatTime(timeLeft.minutes)}
            label="Minutes"
            bgColor={value.timer.bgColor || '#f3f4f6'}
            textColor={value.timer.textColor || '#000'}
            subtitleColor={value.subtitleColor || '#777'}
          />

          <span
            className="text-2xl font-bold mb-8"
            style={{ color: value.timer.textColor || '#000' }}
          >
            :
          </span>

          <TimeUnit
            value={formatTime(timeLeft.seconds)}
            label="Seconds"
            bgColor={value.timer.bgColor || '#f3f4f6'}
            textColor={value.timer.textColor || '#000'}
            subtitleColor={value.subtitleColor || '#777'}
          />
        </div>

        {value.subtitle2 && (
          <p
            className="text-center text-sm"
            style={{ color: value.subtitleColor || '#555' }}
          >
            {value.subtitle2}
          </p>
        )}

        {/* Special Price Section */}
        {value.specialPrice && (
          <div className='flex flex-col justify-center items-center mt-2 mb-4'>
            <div className=' flex flex-col  items-center justify-center mb-2 space-y-1'>
              <div className='text-xl text-gray-800'>
                <span className='font-semibold'>Special Price:</span>
                <span
                  className='text-3xl font-bold'
                  style={{ color: value.specialPrice.offerPriceColor || '#2f855a' }}
                >
                  {' '}
                  ₹{value.specialPrice.offerPrice || '299'}
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-500'>
                <span>MRP</span>
                <span
                  className='line-through'
                  style={{
                    color: value.specialPrice.originalPriceColor || '#777',
                  }}
                >
                  {' '}
                  ₹{value.specialPrice.originalPrice || '399'}
                </span>
              </div>
            </div>
            <p className='text-sm text-gray-600'>
              You save{' '}
              <span className='font-semibold text-green-600'>
                ₹{value.specialPrice.originalPrice - value.specialPrice.offerPrice}
              </span>{' '}
              with this deal.
            </p>
          </div>
        )}

        {/* Coupon Section */}
        {value.coupon && (
          <div className="flex justify-center mt-4">
            <div
              className="flex items-center gap-3 py-2 px-5 border-dashed border-2 rounded-lg bg-gray-50"
              style={{ borderColor: value.coupon.borderColor || '#ccc' }}
            >
              <FaTag size={16} color={value.coupon.iconColor || '#555'} />
              <span
                className="font-semibold tracking-wide"
                style={{ color: value.coupon.textColor || '#000' }}
              >
                {value.coupon.code}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultTimer; 