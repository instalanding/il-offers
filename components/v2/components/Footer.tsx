import React from 'react'
import { TbShoppingBagPlus } from "react-icons/tb";

interface Config {
    primaryColor: string;
    secondaryColor: string;
    footerText: string;
    buttonText: string;
}

const Footer: React.FC<{ config: Config }> = ({ config }) => {
    return (
        <div className="sticky bottom-0 bg-white">
            <div className="flex flex-col">
                <div
                    style={{
                        backgroundColor: config.primaryColor,
                        color: config.secondaryColor
                    }}
                    className="p-1 bg-black bg-opacity-25 flex justify-center items-center gap-2">
                    <p className="text-sm text-black text-center">
                        {config.footerText}
                    </p>
                </div>

                <div className="flex items-center justify-between text-black p-3 rounded-lg gap-5">
                    <span className="text-2xl font-bold">100</span>
                    <button className="flex items-center justify-center gap-2 px-8 py-2 bg-black w-full rounded-lg transition-colors"
                        style={{
                            backgroundColor: config.primaryColor,
                            color: config.secondaryColor
                        }}
                    >
                        <TbShoppingBagPlus size={20} />
                        {config.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Footer
