import Image from "next/image";

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
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const campaign = await getCampaignData(params.slug);
  return (
    <div>
      <Image
        src={campaign[0].meta_description?.image?.url}
        alt={campaign.name}
        width={480}
        height={480}
      />
      <pre>{JSON.stringify(campaign, null, 2)}</pre>
    </div>
  );
};

export default page;

export const dynamic = "force-static";
