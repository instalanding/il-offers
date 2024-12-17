"use client";
import React, { useState } from "react";
import { platforms } from "@/constants/platforms";
import Link from "next/link";
import Image from "next/image";
import { FaTruck } from "react-icons/fa";
// import { useSearchParams } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

declare global {
    interface Window {
        fbq: (...args: any[]) => void;
    }
}

const CtaButton = ({ offer_id, schema, btn, pixel, defaultValue }: any) => {
    const platform = platforms.find((p) => p.type === btn.type);
    const [openAccordion, setOpenAccordion] = useState<string | null>(defaultValue);

    // const searchParams = useSearchParams();
    // const utm_medium = searchParams.get("utm_medium") || null;
    // const utm_source = searchParams.get("utm_source") || null;
    // const utm_campaign = searchParams.get("utm_campaign") || null;

    // console.table([utm_medium, utm_source, utm_campaign]);

    function IntentLink({ href, children, target = "_blank" }: any) {
        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;

            if (/android/i.test(userAgent)) {
                const intentUrl = `intent:${href.replace(/^https?:\/\//, "")}#Intent;package=com.android.chrome;scheme=https;action=android.intent.action.VIEW;end;`;
                window.location.href = intentUrl;
            } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                const iosUrl = href.startsWith("http") ? href : `https://${href}`;
                window.location.href = iosUrl;
            } else {
                window.open(href, target, "noopener,noreferrer");
            }
        };

        return (
            <Link href={href} onClick={handleClick} className="w-full" target={target} rel="noopener noreferrer">
                {children}
            </Link>
        );
    }

    return (
        <Accordion
            type="single"
            collapsible
            defaultValue={defaultValue}
            onValueChange={(value) => setOpenAccordion(value)}
            style={{
                display: btn.isVisible ? "" : "none",
            }}
            className="py-2 px-5"
        >
            <AccordionItem
                value={btn.title}
                className={`rounded-tl-3xl rounded-tr-md shadow-lg shadow-gray-300 hover:shadow-xl hover:shadow-gray-400 ${openAccordion === btn.title
                    ? "border-2 rounded-bl-md rounded-br-3xl shadow-xl shadow-gray-400"
                    : "bg-transparent"
                    }`}
                style={{
                    borderColor: openAccordion === btn.title
                        ? btn.type !== "custom" ? platform?.color : btn.color
                        : "black",
                }}
            >
                <AccordionTrigger
                    style={{
                        background: (btn.type !== "custom" ? platform?.color : btn.color),
                        color:
                            btn.type === "amazon" ||
                                btn.type === "blinkit" ||
                                btn.type === "myntra"
                                ? "black"
                                : btn.type === "custom"
                                    ? btn.textColor
                                    : "white"
                    }}
                    className={`w-full rounded-tl-2xl rounded-tr-sm ${openAccordion === btn.title ? 'rounded-bl-none rounded-br-none' : 'rounded-bl-sm rounded-br-2xl'} px-3 py-[2px] flex items-center`}       >
                    <IntentLink key={btn._id} href={btn.url} target="_blank">
                        <div
                            className="flex gap-2 min-h-12 items-center font-semibold cursor-pointer"
                            id={btn.pixel_event}
                            onClick={(e) => {
                                if (
                                    typeof window !== "undefined" &&
                                    window.gtag_report_conversion &&
                                    offer_id === "6a81a"
                                ) {
                                    window.gtag_report_conversion_zomato();
                                }
                                if (pixel) {
                                    const noscript = document.createElement("noscript");
                                    const img = document.createElement("img");
                                    img.height = 1;
                                    img.width = 1;
                                    img.style.display = "none";
                                    img.src = `https://www.facebook.com/tr?id=${pixel}&ev=${btn.type}ClickedCta&noscript=1`;
                                    img.alt = "Facebook Pixel";
                                    noscript.appendChild(img);
                                    document.body.appendChild(noscript);
                                }
                                if (btn.pixel) {
                                    const noscript = document.createElement("noscript");
                                    const img = document.createElement("img");
                                    img.height = 1;
                                    img.width = 1;
                                    img.style.display = "none";
                                    img.src = `https://www.facebook.com/tr?id=${btn.pixel}&ev=ClickedCta&noscript=1`;
                                    img.alt = "Facebook Pixel";
                                    noscript.appendChild(img);
                                    document.body.appendChild(noscript);
                                }
                            }}
                        >
                            <Image
                                alt={`${platform?.title}_logo`}
                                src={btn.type === "custom" ? btn.icon : platform?.logo}
                                width={50}
                                height={50}
                                className={`w-[50px] h-[50px] object-contain ${btn.type === "amazon" ? "py-3" : ""
                                    } ${btn.type === "custom" && !btn.icon
                                        ? "hidden"
                                        : "block"
                                    }`} />

                            <div className="flex gap-2 justify-between items-center w-full text-left">
                                {/* <div className="flex flex-col"> */}
                                <p className="items-start"> {btn?.title}</p>
                                {/* {openAccordion !== btn.title && <p className="text-xs font-medium">{btn.subtitle || "Pack of 12 at $2.79"}</p>} */}
                                {/* </div> */}
                                <div className="flex flex-col items-end justify-center mr-2">
                                    <p className="font-semibold text-lg">{btn?.offerPrice && `₹${btn?.offerPrice}`}</p>
                                    <p className="line-through font-light text-xs">{btn?.originalPrice &&
                                        `₹${btn?.originalPrice}`}</p>
                                </div>
                            </div>
                        </div>
                    </IntentLink>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="flex mt-4 justify-between items-center gap-5 px-4">
                        <div className="flex gap-4 items-start">
                            <FaTruck
                                size={28}
                                color="gray"
                                className="min-h-7 min-w-7"
                            />

                            <div className="flex flex-col items-start">
                                <p className="text-xs text-left">
                                    {btn.subtitle}
                                </p>

                                {/* <p className="text-xs text-left">
                                    {platform?.subtitle}
                                  </p> */}
                            </div>
                        </div>
                        <div >
                            <IntentLink key={btn._id} href={btn.url} target="_blank">
                                <div
                                    className="cursor-pointer"
                                    id={btn.pixel_event}
                                    onClick={(e) => {
                                        if (
                                            typeof window !== "undefined" &&
                                            window.gtag_report_conversion &&
                                            offer_id === "6a81a"
                                        ) {
                                            window.gtag_report_conversion_zomato();
                                        }
                                        if (pixel) {
                                            const noscript = document.createElement("noscript");
                                            const img = document.createElement("img");
                                            img.height = 1;
                                            img.width = 1;
                                            img.style.display = "none";
                                            img.src = `https://www.facebook.com/tr?id=${pixel}&ev=${btn.type}ClickedCta&noscript=1`;
                                            img.alt = "Facebook Pixel";
                                            noscript.appendChild(img);
                                            document.body.appendChild(noscript);
                                        }
                                        if (btn.pixel) {
                                            const noscript = document.createElement("noscript");
                                            const img = document.createElement("img");
                                            img.height = 1;
                                            img.width = 1;
                                            img.style.display = "none";
                                            img.src = `https://www.facebook.com/tr?id=${btn.pixel}&ev=ClickedCta&noscript=1`;
                                            img.alt = "Facebook Pixel";
                                            noscript.appendChild(img);
                                            document.body.appendChild(noscript);
                                        }
                                    }}
                                >
                                    <button style={{
                                        background: (btn.type !== "custom" ? platform?.color : btn.color),
                                        color:
                                            btn.type === "amazon" ||
                                                btn.type === "blinkit" ||
                                                btn.type === "myntra"
                                                ? "black"
                                                : btn.type === "custom"
                                                    ? btn.textColor
                                                    : "white"
                                    }}
                                        className="min-h-10 cursor-pointer rounded-md px-6 py-[2px] font-semibold flex items-center">
                                        Buy Now                                  </button>
                                </div>
                            </IntentLink></div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

    );
};

export default CtaButton;