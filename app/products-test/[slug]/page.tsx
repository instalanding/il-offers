import Image from "next/image";
import ClientComponent from "./ClientComponent";

type Params = {
  slug: string;
};

type SearchParams = {
  os?: string;
  cpu?: string;
  isBot?: string;
  ua?: string;
  browser?: string;
  device?: string;
  engine?: string;
  user_ip?: string;
  variant?: string;
  variant_id?: string;
  debug?: string;
};

async function getCampaignData(slug: string) {
  const response = await fetch(
    `${process.env.API_URL_V2}/campaign?slug=${slug}`
  );
  const data = await response.json();
  return data.data;
}

const page = async ({
  params,
}: {
  params: Params;
}) => {
  const allCampaigns = await getCampaignData(params.slug);

  return (
    <ClientComponent campaigns={allCampaigns} />
  );
};

export default page;

export const dynamic = "force-static";
