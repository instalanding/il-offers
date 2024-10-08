import { fetchApi } from "@/lib/backendFunctions";
import React, { useEffect, useState } from "react";
import CtaButton from "./CtaButton";

const CTAGeoTracking = ({
  userIp,
  campaignGeoRegion,
  schema,
  offer_id,
  pixel,
}: any) => {
  const [geo, setGeo] = useState<any>(null);

  async function getData(userip: string) {
    const data = await fetchApi(userip);
    const { city, city_geoname_id, region, region_geoname_id } = data;
    setGeo({ city, city_geoname_id, region, region_geoname_id });
  }

  useEffect(() => {
    getData(userIp);
  }, []);

  if (!geo) {
    return (
      <div>
        {schema.buttons.map((m: any, i: number) => {
          return (
            <CtaButton pixel={pixel} key={i} offer_id={offer_id} schema={schema} btn={m} />
          );
        })}
      </div>
    );
  }

  const campaignGeoRegionFiltered = campaignGeoRegion.filter(
    (f: any) =>
      f.geo_id == geo.region_geoname_id || f.geo_id == geo.city_geoname_id
  );

  const ranks = campaignGeoRegionFiltered[0]?.ranks;

  console.log(ranks);

  const newButtons = ranks
    ? schema.buttons.filter((obj: any) => ranks.includes(obj.type))
    : [];

  const orderedButtons = newButtons.sort((a: any, b: any) => {
    return ranks.indexOf(a.type) - ranks.indexOf(b.type);
  });

  if (orderedButtons.length > 0) {
    return (
      <div>
        {orderedButtons.map((m: any, i: any) => {
          return (
            <CtaButton
              pixel={pixel}
              key={i}
              offer_id={offer_id}
              schema={schema}
              btn={m}
            />
          );
        })}
      </div>
    );
  }
  return (
    <div>
      {schema.buttons.map((m: any, i: number) => {
        return (
          <CtaButton
            pixel={pixel}
            key={i}
            offer_id={offer_id}
            schema={schema}
            btn={m}
          />
        );
      })}
    </div>
  );
};

export default CTAGeoTracking;
