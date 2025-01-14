"use server";
import React from "react";
import { userAgent } from "next/server";
import { permanentRedirect } from "next/navigation";

interface PageProps {
  params: { offer_id: string };
  searchParams: { mode: string; user_ip?: any };
}

const getDeeplink = async (offer_id: string) => {
  try {
    console.log(`${process.env.API_URL}deeplink/${offer_id}`);

    const response = await fetch(`${process.env.API_URL}deeplink/${offer_id}`, {
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

  const data = await getDeeplink(offer_id);

  console.log(data);

  let redirectUrl = data.product_url;
  let href = data.product_url;
  const buttonType: string = data.cta_type;

  if (buttonType === "amazon") {
    redirectUrl = `${process.env.REDIRECT_SCRIPT_URL}amazon-redirect/?redirect_url=${href}&ctatype=${buttonType}`;
  } else {
    if (/android/i.test(userAgent.toString())) {
      redirectUrl = `intent:${href.replace(
        /^https?:\/\//,
        ""
      )}#Intent;package=com.android.chrome;scheme=https;action=android.intent.action.VIEW;end;`;
    } else if (
      /iPad|iPhone|iPod/.test(userAgent.toString()) &&
      !/windows/i.test(userAgent.toString())
    ) {
      redirectUrl = href.startsWith("http") ? href : `https://${href}`;
    }
  }
  permanentRedirect(redirectUrl);
};

export default Page;
