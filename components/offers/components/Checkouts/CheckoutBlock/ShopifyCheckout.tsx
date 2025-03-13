import React from 'react'
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ShopifyCheckoutProps {
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

const ShopifyCheckout = ({
    value,
    style,
    quantity,
    handleIncrease,
    handleDecrease,
    checkoutData,
    isSoldOut,
    recordClicks
}: ShopifyCheckoutProps) => {
    const router = useRouter();

    const handleCheckoutButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const params = new URLSearchParams();
        params.append('discount', checkoutData.coupon_code);

        // Add all UTM parameters from checkoutData
        const utmParams = checkoutData.utm_params as Record<string, string>;
        Object.entries(utmParams).forEach(([key, value]) => {
            if (value) {
                params.append(key, value);
            }
        });

        router.push(
            `https://${checkoutData.store_url}/cart/${checkoutData.variant_id}:${quantity}?${params.toString()}`
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

export default ShopifyCheckout;
