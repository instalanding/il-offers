import React from 'react';

const VariantsComponent: React.FC<{ variantType: string | null }> = ({ variantType }) => {
    return (
        <div>
            <p>Variant Type: {variantType || 'None selected'}</p>
        </div>
    );
};

export default VariantsComponent;
