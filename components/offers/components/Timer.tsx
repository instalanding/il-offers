import React, { useState, useEffect } from 'react';
import DefaultTimer from './Timer/DefaultTimer';
import ModernTimer from './Timer/ModernTimer';
import MinimalTimer from './Timer/MinimalTimer';

interface TimerProps {
  value: {
    title?: string;
    titleColor?: string;
    subtitle1?: string;
    subtitle2?: string;
    subtitleColor?: string;
    timer: {
      isActive: boolean;
      hours: number;
      minutes: number;
      seconds: number;
      style: 'default' | 'modern' | 'minimal';
      textColor: string;
      bgColor: string;
      endBehavior: 'stop' | 'restart' | 'hide';
      restartDelay: number;
    };
    coupon?: {
      code: string;
      textColor: string;
      borderColor: string;
      iconColor: string;
    };
    specialPrice?: {
      offerPrice: number | string;
      originalPrice: number | string;
      offerPriceColor: string;
      originalPriceColor: string;
    };
  };
  style?: React.CSSProperties;
}

const Timer: React.FC<TimerProps> = ({ value, style }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: value.timer?.hours || 0,
    minutes: value.timer?.minutes || 0,
    seconds: value.timer?.seconds || 0,
  });
  const [isTimerEnded, setIsTimerEnded] = useState(false);
  const [isInRestartDelay, setIsInRestartDelay] = useState(false);
  const [endMessage] = useState(
    'This offer is no longer available. Check back soon for more deals'
  );

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    let restartTimeout: NodeJS.Timeout | null = null;

    const startTimer = () => {
      // Clear any existing timers
      if (timerInterval) clearInterval(timerInterval);
      if (restartTimeout) clearTimeout(restartTimeout);

      // Reset timer state
      setTimeLeft({
        hours: value.timer?.hours || 0,
        minutes: value.timer?.minutes || 0,
        seconds: value.timer?.seconds || 0,
      });
      setIsTimerEnded(false);
      setIsInRestartDelay(false);

      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          // Calculate total seconds
          let totalSeconds =
            prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds;

          // If timer has ended
          if (totalSeconds <= 0) {
            clearInterval(timerInterval!);
            setIsTimerEnded(true);

            // Handle different end behaviors
            switch (value.timer.endBehavior) {
              case 'restart':
                setIsInRestartDelay(true);
                restartTimeout = setTimeout(() => {
                  setIsInRestartDelay(false);
                  startTimer(); // Restart the timer after delay
                }, value.timer.restartDelay || 5000);
                break;
              case 'hide':
              case 'stop':
                // Do nothing, just let it end
                break;
            }

            return { hours: 0, minutes: 0, seconds: 0 };
          }

          // Decrement total seconds
          totalSeconds--;

          // Calculate new hours, minutes, seconds
          const newHours = Math.floor(totalSeconds / 3600);
          const newMinutes = Math.floor((totalSeconds % 3600) / 60);
          const newSeconds = totalSeconds % 60;

          return {
            hours: newHours,
            minutes: newMinutes,
            seconds: newSeconds,
          };
        });
      }, 1000);
    };

    if (value.timer.isActive) {
      startTimer();
    }

    // Cleanup function
    return () => {
      if (timerInterval) clearInterval(timerInterval);
      if (restartTimeout) clearTimeout(restartTimeout);
    };
  }, [value.timer.hours, value.timer.minutes, value.timer.seconds, value.timer.endBehavior, value.timer.restartDelay, value.timer.isActive]);

  const formatTime = (time: number): string => {
    return time < 10 ? `0${time}` : time.toString();
  };

  // Helper functions to check visibility conditions
  const shouldShowPrice = () => {
    return value.specialPrice?.offerPrice && value.specialPrice?.originalPrice;
  };

  const shouldShowCoupon = () => {
    return value.coupon?.code && value.coupon.code.trim() !== '';
  };

  // If timer has ended and behavior is hide, or in restart delay, show end message
  if (
    (isTimerEnded && value.timer.endBehavior === 'hide') ||
    (isTimerEnded && value.timer.endBehavior === 'restart' && isInRestartDelay)
  ) {
    return (
      <div className='text-center p-4' style={{ color: value.timer.textColor || '#000' }}>
        {endMessage}
      </div>
    );
  }

  // Shared props for all timer styles
  const timerProps = {
    timeLeft,
    formatTime,
    isTimerEnded,
    value: {
      ...value,
      showSpecialPrice: shouldShowPrice(),
      showCoupon: shouldShowCoupon(),
    },
    style,
  };

  // If timer has ended and behavior is stop, show the timer frozen at 00:00:00
  if (isTimerEnded && value.timer.endBehavior === 'stop') {
    timerProps.timeLeft = { hours: 0, minutes: 0, seconds: 0 };
  }

  // Render the appropriate timer style
  switch (value.timer.style) {
    case 'modern':
      return <ModernTimer {...timerProps} />;
    case 'minimal':
      return <MinimalTimer {...timerProps} />;
    default:
      return <DefaultTimer {...timerProps} />;
  }
};

export default Timer; 