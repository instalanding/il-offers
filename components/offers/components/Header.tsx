import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const Header: React.FC<{ config: { primaryColor: string; secondaryColor: string; headerText: string; }, logo: string; offerId: string; storeUrl: string; utm_params: any; }> = ({ config, logo, offerId, storeUrl, utm_params }) => {
    return (
        <>
            <link rel="preload" href={logo} as="image" />
            <div className="sticky top-0 h-auto z-50">
                {config.headerText && (<p
                    style={{
                        backgroundColor: config.primaryColor,
                        color: config.secondaryColor,
                    }}
                    className="text-[12px] text-center p-2 px-6"
                >
                    {config.headerText}
                </p>)}
                {logo && (
                    <Link
                        href={`https://${storeUrl}/?utm_source=${utm_params.utm_source || "instalanding"}&utm_medium=${utm_params.utm_medium || "landing_page"}&utm_campaign=${offerId}`}
                    >
                        <div className="flex flex-col items-center justify-center py-2 bg-white -z-50">
                            <Image
                                alt={"Upload a logo"}
                                src={logo}
                                className="h-[60px] py-2 w-auto object-contain"
                                width={310}
                                height={310}
                                priority={true}
                                loading='eager'
                            />
                        </div>
                    </Link>)}
            </div>
        </>
    );
};

export default Header;
