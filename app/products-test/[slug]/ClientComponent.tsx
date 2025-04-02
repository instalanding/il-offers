"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const ClientComponent = ({ campaigns }: { campaigns: any }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Convert searchParams to an object containing all parameters
  const allParams: { [key: string]: string } = {};
  searchParams.forEach((value, key) => {
    allParams[key] = value;
  });

  const filteredCampaigns = campaigns.filter((campaign: any) => {
    return campaign.variant_id === allParams.variant;
  });

  const campaign = filteredCampaigns.length > 0 ? filteredCampaigns[0] : campaigns[0];

  useEffect(() => {
    if (!allParams.variant && campaign.variant_id) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('variant', campaign.variant_id);
      router.push(`?${newParams.toString()}`);
    }
  }, [campaign.variant_id, allParams.variant, router, searchParams]);

  const blocks = JSON.parse(campaign.blocks);

  return (
    <div className="flex justify-center h-screen p-3 max-sm:p-0">
      <div className="w-[400px] border border-gray-300 rounded-md flex flex-col">
        <div className="flex-1 overflow-y-auto flex-grow">
          <h1>All Search Parameters:</h1>
          <pre>{JSON.stringify(allParams, null, 2)}</pre>
          <Image
            src={campaign.meta_description?.image.url}
            alt={"Campaign image"}
            width={480}
            height={480}
          />
          <h1>Blocks</h1>
          <pre>{JSON.stringify(blocks, null, 2)}</pre>
          <h1>Campaign</h1>
          <pre>{JSON.stringify(campaign, null, 2)}</pre>
          <CampaignBlocks blocks={blocks} />
        </div>
        <div className="sticky bottom-0 right-0 bg-white border-t border-gray-300 p-3">
          hello
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
