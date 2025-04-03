import Checkout from "./Checkout";
import Price from "./Price";

const Footer = ({ campaign }: { campaign: any }) => {
  return (
    <div>
      {campaign.config.footer_text && <p
        className="text-center text-sm text-white p-1"
        style={{ backgroundColor: campaign.config.primary_color + "5a"}}
      >
        {campaign.config.footer_text}
      </p>}
      <div className="flex justify-between p-[10px]">
        <Price price={campaign.price} config={campaign.config} />
        <Checkout campaign={campaign} />
      </div>
    </div>
  );
};

export default Footer;
