"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTruck } from "react-icons/fa";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const MultiCta = ({ value, style }: any) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    return (
        <Accordion
            type="single"
            collapsible
            onValueChange={(value) => setOpenAccordion(value)}
            className="flex flex-col gap-4" style={style}
        >
            {value.map((cta: any) => (
                <AccordionItem
                    key={cta.id}
                    value={cta.ctaType}
                    className={`rounded-tl-3xl rounded-tr-md shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-gray-200 
                            ${openAccordion === cta.ctaType
                            ? "border-2 shadow-xl shadow-gray-300 rounded-br-3xl rounded-bl-md"
                            : "bg-transparent"
                        }`}
                    style={{
                        borderColor: openAccordion === cta.ctaType ? cta.color : "black",
                    }}
                >
                    <AccordionTrigger
                        className={`flex items-center justify-between p-4 cursor-pointer rounded-tl-3xl rounded-tr-md 
                                ${openAccordion !== cta.ctaType
                                ? "rounded-br-3xl rounded-bl-md"
                                : ""
                            }`}
                        style={{
                            background: cta.style.backgroundColor,
                            color:
                                cta.color === "#FF9900" || cta.color === "#2874F0"
                                    ? "black"
                                    : "white",
                        }}
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                                <Image
                                    alt={`${cta.ctaType}_logo`}
                                    src={cta.logo}
                                    width={50}
                                    height={50}
                                    className="object-contain"
                                />
                                <span className="ml-2 font-medium">{cta.ctaType}</span>
                            </div>
                            <div className="font-semibold mr-2">₹{cta.price}</div>
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
                        <Link href={cta.link} target="_blank" rel="noopener noreferrer">
                            <button
                                style={{
                                    background: cta.style.backgroundColor,
                                    color:
                                        cta.color === "#FF9900" || cta.color === "#2874F0"
                                            ? "black"
                                            : "white",
                                }}
                                className="min-h-10 cursor-pointer rounded-md px-6 py-[2px] font-medium flex items-center whitespace-nowrap"
                            >
                                Buy Now
                            </button>
                        </Link>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default MultiCta;