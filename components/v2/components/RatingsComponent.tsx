import React from 'react';

const RatingsComponent: React.FC<{ price: number; discount: number }> = ({ price, discount }) => {
    return (
        <div>
            <p>Price: ${price}</p>
            <p>Discount: {discount}%</p>
        </div>
    );
};

export default RatingsComponent;