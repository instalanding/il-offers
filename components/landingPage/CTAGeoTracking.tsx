import React from "react";
import CtaButton from "./CtaButton";

const CTAGeoTracking = ({
  schema,
  offer_id,
  pixel,
}: any) => {

  return (
    <div className="flex flex-col gap-4 px-4">
      {schema.buttons.map((m: any, i: number) => {
        return (
          <CtaButton
            pixel={pixel}
            key={i}
            offer_id={offer_id}
            schema={schema}
            btn={m}
            defaultValue={schema.buttons[0]?.title}
          />
        );
      })}
    </div>
  );
};

export default CTAGeoTracking;
