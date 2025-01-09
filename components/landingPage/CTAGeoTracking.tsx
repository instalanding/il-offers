import React from "react";
import CtaButton from "./CtaButton";

const CTAGeoTracking = ({
  schema,
  offer_id,
  pixel,
  userIp,
  campaign_id
}: any) => {

  return (
    <div className="flex flex-col gap-1">
      {schema.buttons.map((m: any, i: number) => {
        return (
          <CtaButton
            pixel={pixel}
            key={i}
            offer_id={offer_id}
            schema={schema}
            btn={m}
            defaultValue={schema.buttons[0]?.title}
            user_ip={userIp}
            campaign_id={campaign_id}
          />
        );
      })}
    </div>
  );
};

export default CTAGeoTracking;
