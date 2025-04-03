import Image from "next/image";
import Link from "next/link";

const Header = ({ campaign }: { campaign: any }) => {
  const storeLogo = campaign.advertiser.store_logo.url;
  const storeUrl = campaign.advertiser.store_url;
  return (
    <div>
      {campaign.config.header_text && (
        <p
          className="text-center text-sm text-white p-1"
          style={{ backgroundColor: campaign.config.primary_color }}
        >
          {campaign.config.header_text}
        </p>
      )}
      <div className="flex justify-center items-center p-2">
        <Link href={`https://${storeUrl}`} target="_blank">
          <Image src={storeLogo} alt={"logo"} height={150} />
        </Link>
      </div>
    </div>
  );
};

export default Header;
