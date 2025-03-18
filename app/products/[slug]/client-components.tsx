"use client";

import { useSearchParams } from "next/navigation";
import Campaigns from "@/components/offers/Campaigns";
import { useEffect } from "react";

function loadFont(fontFamily: string) {
  const FONT_MAPPING: Record<string, string> = {
    Oswald: "Oswald:wght@400;500;600;700",
    Roboto: "Roboto:wght@400;500;700",
    "Open Sans": "Open+Sans:wght@400;500;600;700",
    Lato: "Lato:wght@400;700",
    Montserrat: "Montserrat:wght@400;500;600;700",
    Poppins: "Poppins:wght@400;500;600;700",
    Inter: "Inter:wght@400;500;600;700",
  };

  const fontName = fontFamily.replace(/["']/g, "").split(",")[0].trim();
  const fontUrl = FONT_MAPPING[fontName] || FONT_MAPPING["Inter"]; // Default to Inter if not found

  // Create link elements to load the font
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`;
  document.head.appendChild(link);

  // Create a style element to apply the font
  const style = document.createElement("style");
  style.textContent = `
    html, body, * {
      font-family: ${fontName}, -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
  `;
  document.head.appendChild(style);

  // Return a cleanup function
  return () => {
    document.head.removeChild(link);
    document.head.removeChild(style);
  };
}

export function CampaignWithParams({
  campaignData,
  userIp,
}: {
  campaignData: any;
  userIp: string;
}) {
  const searchParams = useSearchParams();
  const variant = searchParams.get("variant");

  const filteredCampaign = variant
    ? campaignData.filter((campaign: any) => campaign.variant_id === variant)
    : campaignData;

  const utm_params = Object.fromEntries(
    Array.from(searchParams.entries()).filter(
      ([key]) =>
        key.startsWith("utm_") ||
        ["source", "medium", "campaign", "id", "term", "content"].includes(key)
    )
  );

  const fontFamily = filteredCampaign[0].config.font_family;

  useEffect(() => {
    const cleanup = loadFont(filteredCampaign[0].config.font_family);
    return cleanup;
  }, [fontFamily]);

  return (
    <Campaigns
      campaignData={{
        ...(filteredCampaign.length > 0 ? filteredCampaign[0] : {}),
        collections: { variants: campaignData },
        reviews: [],
      }}
      userIp={userIp}
      utm_params={utm_params}
    />
  );
}
