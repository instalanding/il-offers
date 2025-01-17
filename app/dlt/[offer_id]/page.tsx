"use server";
import React from "react";
import Redirect from "./Redirect";
import { new_backend_url } from "@/utils/constants";
import { userAgent } from "next/server";
import { permanentRedirect } from "next/navigation";

interface PageProps {
  params: { offer_id: string };
  searchParams: { mode: string; user_ip?: any };
}

const getDeeplink = async (offer_id: string) => {
  try {
    console.log(`${new_backend_url}deeplink/${offer_id}`);

    const response = await fetch(`${new_backend_url}deeplink/${offer_id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch campaign");
    }
    const data = await response.json(); // Process the JSON body
    // console.log(data, "response data"); // Log the actual response data
    return data; // Return the parsed data
  } catch (error) {
    console.log(error);
  }
};

const Page: React.FC<PageProps> = async ({ params, searchParams }) => {
  const { offer_id } = params;


  // data fetched here

  const data = await getDeeplink(offer_id);

  // redirect happens here

  if(!data){
    return <div>Deeplink not found</div>
  }

  return <Redirect data={data} />;

};

export default Page;
