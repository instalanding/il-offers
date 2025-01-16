"use client";

import React, { useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { userAgent } from "next/server";
import { permanentRedirect } from "next/navigation";
import { new_backend_url } from "@/utils/constants";

const Redirect = ({ data }: any) => {
  const redirectToExternal = (url: string) => {
    // Set the external URL you want to redirect to
    window.location.href = url;
  };

  const getVisitorId = async () => {
    if (typeof window === "undefined") return;

    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      console.log(result.visitorId);
      await hit(result.visitorId);
    } catch (error) {
      console.error("Error getting visitor identifier:", error);
      return null;
    }
  };

  const hit = async (fp: string) => {
    console.log(new_backend_url);

    await fetch(
      `${new_backend_url}record-redirect/?fp=${fp}&offer_id=${data.offer_id}&advertiser=${data.advertiser}`,
      {
        cache: "no-store",
      }
    );
  };

  let redirectUrl = data.product_url;
  let href = data.product_url;
  const buttonType: string = data.cta_type;

  if (buttonType === "amazon") {
    redirectUrl = `${process.env.NEXT_PUBLIC_REDIRECT_SCRIPT_URL}amazon-redirect/?redirect_url=${href}&ctatype=${buttonType}`;
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

  useEffect(() => {
    getVisitorId().then(() => {
      redirectToExternal(redirectUrl);
    });
  }, []);

  return <>redirecting...</>;
};

export default Redirect;
