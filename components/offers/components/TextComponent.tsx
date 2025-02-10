import React from "react";

interface TextComponentProps {
    value: string;
    style?: React.CSSProperties;
    htmlTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

const TextComponent: React.FC<TextComponentProps> = ({ value, style, htmlTag = "p" }) => {
    const fontWeightClasses = {
        h1: 'font-bold',
        h2: 'font-semibold',
        h3: 'font-medium',
        h4: 'font-normal',
        h5: 'font-light',
        h6: 'font-thin',
        p: 'font-normal',
        span: 'font-normal',
    };
    return React.createElement(
        htmlTag,
        {
            className: `${fontWeightClasses[htmlTag] || 'font-normal'}`,
            style,
        },
        value
    );
};

export default TextComponent;