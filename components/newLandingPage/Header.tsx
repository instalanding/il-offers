import React from "react";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  currentSchema: any;
  offer_id: string;
  logo: string;
  offer_ids: string[];
}

const Header: React.FC<HeaderProps> = ({ currentSchema, offer_id, logo, offer_ids }) => {
  return (
    <div className="sticky top-0 z-50">
      {currentSchema?.creative?.text && (
        <div>
          <p
            style={{
              backgroundColor: currentSchema.config.backgroundColor,
              color: currentSchema?.config?.textColor,
            }}
            className="text-[12px] text-white text-center p-2 px-6"
          >
            {currentSchema.creative.text}
          </p>
        </div>
      )}
      <div
        className={`flex flex-col items-center justify-center ${offer_ids.includes(offer_id) ? "bg-[#122442]" : "bg-white"
          }`}
      >
        <Link
          href={`https://${currentSchema.store_url}/?utm_source=instalanding&utm_medium=landing_page&utm_campaign=${offer_id}`}
        >
          <Image
            alt={`logo`}
            src={logo}
            width={1000}
            height={1000}
            className="h-[60px] py-2 height-auto object-contain"
          />
        </Link>
      </div>
    </div>
  );
};

export default Header;
