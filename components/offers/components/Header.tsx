import React from 'react';
import Image from 'next/image';

const Header: React.FC<{ config: { primaryColor: string; secondaryColor: string; headerText: string; } }> = ({ config }) => {
    return (
        <div className="sticky top-0 h-auto z-50">
            <p
                style={{
                    backgroundColor: config.primaryColor,
                    color: config.secondaryColor,
                }}
                className="text-[12px] text-center p-2 px-6"
            >
                {config.headerText}
            </p>
            <div className="flex flex-col items-center justify-center py-2 bg-white -z-50">
                <Image
                    alt={"upload a logo"}
                    src={"https://cdn.prod.website-files.com/63ad1b6ffdf77fc81d8ffbd0/6446d79cca09a8138f51b8d1_foxtale.svg"}
                    className="h-[60px] py-2 height-auto object-contain"
                    width={310}
                    height={310}
                />
            </div>
        </div>
    );
};

export default Header;
