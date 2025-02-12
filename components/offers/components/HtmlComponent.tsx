import React from 'react';

const HtmlComponent: React.FC<{ value: string; style?: React.CSSProperties }> = ({ value, style }) => {
    return (
        <div style={style} className="text-editor-css" dangerouslySetInnerHTML={{ __html: value }}></div>
    );
};

export default HtmlComponent; 