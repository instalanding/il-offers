import React from "react";

interface TextComponentProps {
    value: string;
    style?: React.CSSProperties;
    htmlTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

const TextComponent: React.FC<TextComponentProps> = ({ value, style, htmlTag = "p" }) => {
    const defaultStyles: Record<string, React.CSSProperties> = {
        h1: { fontSize: "3rem", fontWeight: 700, lineHeight: "1.2", letterSpacing: "-0.02em" },
        h2: { fontSize: "2.5rem", fontWeight: 700, lineHeight: "1.3", letterSpacing: "-0.01em" },
        h3: { fontSize: "2rem", fontWeight: 600, lineHeight: "1.3", letterSpacing: "0em" },
        h4: { fontSize: "1.75rem", fontWeight: 500, lineHeight: "1.4", letterSpacing: "0.02em" },
        h5: { fontSize: "1.5rem", fontWeight: 500, lineHeight: "1.5", letterSpacing: "0.03em" },
        h6: { fontSize: "1.25rem", fontWeight: 400, lineHeight: "1.6", letterSpacing: "0.04em" },
        p: { fontSize: "1rem", fontWeight: 400, lineHeight: "1.7", letterSpacing: "0.02em" },
        span: { fontSize: "1rem", fontWeight: 400, lineHeight: "1.6", letterSpacing: "0.02em" },
    };

    const combinedStyles: React.CSSProperties = { ...defaultStyles[htmlTag] || defaultStyles.p, ...style };

    return React.createElement(htmlTag, { style: combinedStyles }, value);
};

export default TextComponent;