import React from 'react';

const TextComponent: React.FC<{ value: string; style?: React.CSSProperties }> = ({ value, style }) => {
    return (
        <h1 style={style}>{value}</h1>
    );
};

export default TextComponent; 