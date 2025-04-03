import Image from "next/image";
import ClientComponent from "./ClientComponent";

type Params = {
  slug: string;
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
