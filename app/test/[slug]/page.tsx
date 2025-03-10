import { CampaignWithParams } from "./client-components";


const page = async ({
  params,
}: {
  params: { slug: string };
}) => {

  const response = await fetch(
    `${process.env.API_URL_V2}/campaign?slug=${params.slug}`,
    {
      next: {
        revalidate: 600,
      },
    }
  );
  const data = await response.json();

  return (
    <div>
      <CampaignWithParams campaignData={data.data} userIp={""} />
    </div>
  );
};

export default page;

// Generate static params for specific slug
export async function generateStaticParams() {
  return [
    {
      slug: "saptamveda-spirulina-capsules-2000-mg-per-serving",
    },
  ];
}

// // Force static generation
export const dynamic = "force-static";
