"use client";
import React, { useState } from "react";
import { FaTruck } from "react-icons/fa";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import Image from "next/image";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { userAgent } from "next/server";

const MultiCta = ({ value, style, checkoutData }: any) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const getVisitorId = async () => {
        if (typeof window === "undefined") return;

        try {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            return result.visitorId;
        } catch (error) {
            console.error("Error getting visitor identifier:", error);
            return null;
        }
    };

    const redirectToExternal = (url: string) => {
        // Set the external URL you want to redirect to
        window.location.replace(url);
      };

    async function redirect(redirect_url: string, cta_type: string) {
        let redirectUrl = redirect_url;
        let href = redirect_url;
        const buttonType: string = cta_type;

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

        redirectToExternal(redirectUrl);
    }

    async function recordClicks(
        ctaType: string
    ) {
        try {
            const visitorId = await getVisitorId();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}analytics/clicks/?offer_id=${checkoutData.offer_id}&advertiser_id=${checkoutData.advertiser_id}&user_ip=${checkoutData.userIp}&product_url=${checkoutData.store_url}&visitor_id=${visitorId}&campaign_id=${checkoutData.campaign_id}&ctatype=${ctaType}`,
                {}
            );
        } catch (error) {
            console.error("Error recording click:", error);
        }
    }
    return (
        <Accordion
            type="single"
            collapsible
            onValueChange={(value) => setOpenAccordion(value)}
            className="flex flex-col gap-3"
            style={style}
        >
            {value.map((cta: any) => (
                <AccordionItem
                    key={cta._id}
                    value={cta.type}
                    className={`rounded-tl-3xl rounded-tr-md shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-gray-200 
                            ${openAccordion === cta.type
                            ? "border-2 shadow-xl shadow-gray-300 rounded-br-3xl rounded-bl-md"
                            : "bg-transparent"
                        }`}
                    style={{
                        borderColor: openAccordion === cta.type ? cta.color : "black",
                    }}
                >
                    <AccordionTrigger
                        className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-tl-2xl rounded-tr-sm
                                ${openAccordion !== cta.type ? "rounded-br-3xl rounded-bl-md" : ""}`}
                        style={{
                            background: cta.color,
                            color: cta.textColor
                        }}
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                                <Image
                                    alt={`${cta.type}_logo`}
                                    src={cta.icon}
                                    width={35}
                                    height={35}
                                    className="object-contain"
                                />
                                <span className="ml-2 font-medium">{cta.title}</span>
                            </div>
                            <div className="flex flex-col items-end justify-center mr-2">
                                <p className="font-semibold text-lg">
                                    {cta?.offerPrice && `₹${cta?.offerPrice}`}
                                </p>
                                <p className="line-through font-light text-xs">
                                    {cta?.originalPrice && `₹${cta?.originalPrice}`}
                                </p>
                            </div>

                        </div>
                    </AccordionTrigger>

                    <AccordionContent
                        className="flex justify-between items-center gap-5 px-4 py-2 rounded-br-3xl rounded-bl-md"
                    >
                        <div className="flex gap-4 items-center">
                            <FaTruck size={28} color="gray" className="min-h-7 min-w-7" />
                            <div className="flex flex-col items-start">
                                <p className="text-xs text-left">{cta.subtitle}</p>
                            </div>
                        </div>
                        {/* <Link href={cta.url} target="_blank" rel="noopener noreferrer"> */}
                            <Button
                                onClick={() => {
                                    recordClicks(cta.type)
                                    redirect(cta.url, cta.type)
                                }}
                                style={{
                                    background: cta.color,
                                    color: cta.textColor,
                                }}
                                className="min-h-10 cursor-pointer rounded-md px-6 py-[2px] font-medium flex items-center whitespace-nowrap"
                            >
                                Buy Now
                            </Button>
                        {/* </Link> */}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default MultiCta;
