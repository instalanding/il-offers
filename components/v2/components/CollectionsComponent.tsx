import React from 'react';
interface CollectionsComponentProps {
    value: {
        title: string;
        subtitle: string;
    };
    style?: React.CSSProperties;
}

const CollectionsComponent: React.FC<CollectionsComponentProps> = ({ value, style }) => {


    return (
        <div style={style} className="flex flex-col">
            collections
        </div>
    );
};



export default CollectionsComponent;