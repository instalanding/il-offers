"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IoMdShare } from "react-icons/io";
import { MdOutlineCopyAll } from "react-icons/md";
import { FaFacebook, FaWhatsappSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiArrowRightSLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

export function ShareDialog({ shareLink, offer_id }: any) {
    const [copied, setCopied] = useState(false);
    

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <IoMdShare />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share this coupon</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <div className="flex border justify-between rounded-md items-center px-3 py-2">
                        <p className="text-[12px] font-semibold">vri.li/{offer_id}</p>
                        <div className="flex gap-2 text-blue-500 cursor-pointer" onClick={handleCopy}>
                            <MdOutlineCopyAll size={22} />
                            <p className="text-sm">{copied ? "Copied!" : "Copy"}</p>
                        </div>
                    </div>
                    <div className="mt-7 flex justify-between items-center cursor-pointer" onClick={() => handleShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`)}>
                        <div className="flex items-center gap-2">
                            <FaFacebook size={22} className="text-blue-500" />
                            <p className="text-sm text-slate-700">Share on Facebook</p>
                        </div>
                        <RiArrowRightSLine />
                    </div>
                    <div className="mt-5 flex justify-between items-center cursor-pointer" onClick={() => handleShare(`https://wa.me/?text=${encodeURIComponent(shareLink)}`)}>
                        <div className="flex items-center gap-2">
                            <FaWhatsappSquare size={22} className="text-green-500" />
                            <p className="text-sm text-slate-700">Share on Whatsapp</p>
                        </div>
                        <RiArrowRightSLine />
                    </div>
                    <div className="mt-5 flex justify-between items-center cursor-pointer" onClick={() => handleShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}`)}>
                        <div className="flex items-center gap-2">
                            <FaXTwitter size={20} />
                            <p className="text-sm text-slate-700">Share on X (Formerly Twitter)</p>
                        </div>
                        <RiArrowRightSLine />
                    </div>
                    <div className="mt-5 flex justify-between items-center cursor-pointer" onClick={() => handleShare(`mailto:?subject=Check out this offer&body=${encodeURIComponent(shareLink)}`)}>
                        <div className="flex items-center gap-2">
                            <MdEmail size={22} />
                            <p className="text-sm text-slate-700">Share via Email</p>
                        </div>
                        <RiArrowRightSLine />
                    </div>
                </div>
                <DialogFooter>
                    <Link href={"https://dashboard.instalanding.in"} passHref={true} target='_blank'>
                        <Button type="button">Create your own</Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
