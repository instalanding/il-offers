import React from 'react'
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import useCheckout from '@/hooks/Checkout';

interface FastrrCheckoutProps {
    value: {
        quantity: boolean,
        color: string,
        alignment: string,
        width: string,
        buttonText: string
    },
    style?: React.CSSProperties;
    quantity: number;
    handleIncrease: () => void;
    handleDecrease: () => void;
    checkoutData: any;
    isSoldOut: boolean;
    recordClicks: () => void;
}

const FastrrCheckout = ({
    value,
    style,
    quantity,
    handleIncrease,
    handleDecrease,
    checkoutData,
    isSoldOut,
    recordClicks
}: FastrrCheckoutProps) => {
    const { handleCheckout, handleMouseEnter, handleTouchStart } = useCheckout();

    const handleCheckoutButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        handleCheckout(
            e,
            checkoutData.variant_id,
            checkoutData.offer_id,
            checkoutData.coupon_code,
            checkoutData.utm_params,
            quantity
        );
        recordClicks();
    };

    const alignmentStyle = {
        display: 'flex',
        justifyContent:
            value.alignment === 'left'
                ? 'flex-start'
                : value.alignment === 'right'
                    ? 'flex-end'
                    : 'center',
    };

    return (
        <div className='flex gap-2 w-full' style={{ ...style, ...alignmentStyle }}>
            {value.quantity && (
                <div className='flex items-center gap-2 border rounded-lg py-2 px-1 w-auto'>
                    <button
                        onClick={handleDecrease}
                        disabled={quantity === 1}
                        className='disabled:opacity-50'
                    >
                        <IoIosRemove size={18} />
                    </button>
                    <span className='text-lg font-semibold'>{quantity}</span>
                    <button onClick={handleIncrease}>
                        <IoIosAdd size={18} />
                    </button>
                </div>
            )}
            <div style={{ width: value.width }}>
                <Button
                    onClick={handleCheckoutButtonClick}
                    onMouseEnter={handleMouseEnter}
                    onTouchStart={handleTouchStart}
                    disabled={isSoldOut}
                    className={`border flex items-center justify-center text-[18px] gap-2 px-8 py-2 h-full rounded-lg transition-colors w-full ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: value.color }}
                >
                    {isSoldOut ? 'Sold Out' : value.buttonText}
                </Button>
            </div>
        </div>
    );
}

export default FastrrCheckout;
