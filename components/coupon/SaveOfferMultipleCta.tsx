"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react";
import Confetti from 'react-confetti';
import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { formatDate } from "@/lib/dateFormat";
import useGenerateOfferPDF from "@/hooks/GeneratePdfButton";
import { GiSaveArrow } from "react-icons/gi";

interface DialogProp {
    offer_id: string,
    product_url: string,
    data: any,
    className?: any,
    advertiser_id?: string,
    coupon_code?: string,
    userIp?: string,
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    phone: z.string().min(10, {
        message: "Invalid phone number",
    }),
})
export function SaveOfferMultipleCta({ offer_id, product_url, data, className, advertiser_id, coupon_code, userIp }: DialogProp) {
    const hiddenDivRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [qrCode, setQrCode] = useState<string>("");
    const [showConfetti, setShowConfetti] = useState(false);
    const { generatePDF } = useGenerateOfferPDF();
    const [isError, setIsError] = useState("");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setSaving(true)
        const reqbody = {
            phone: values.phone,
            product_url,
            offer_id,
            name: values.name,
            advertiser_id: data.advertiser
        }
        try {
            const response = await axios.post(`api/saveoffer/?offer_id=${offer_id}&user_ip=${userIp}&tags=${data?.tags}`, reqbody);
            console.log(response.data);
            setShowConfetti(true);
            generatePDF(data, values.phone, values.name, qrCode)
            setOpen(false)
        } catch (error: any) {
            console.error("Error saving the offer:", error);
            console.log(error, "status")
            if (error?.response?.status === 409) {
                setIsError(`Offer is already saved for ${values.phone}`)
            }
        } finally {
            setSaving(false)
        }
    }

    const generateQrCode = async () => {
        try {
            const response = await axios.get(`api/generate-qr/?offer_id=${offer_id}&advertiser_id=${advertiser_id}&coupon_code=${coupon_code}&camp_type=${data?.campaign_type}&redirect_url=${`https://vri.li/${offer_id}`}`)
            setQrCode(response.data)
        } catch (err) {
            console.log(err)
        }
    }
    console.log(isError, "isError")

    useEffect(() => {
        generateQrCode()
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="p-4 w-full font-semibold flex items-center justify-center gap-2 border-r">
                    <GiSaveArrow />
                    Save offer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Save this offer</DialogTitle>
                    <DialogDescription>
                        To save this offer enter your phone number and name
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="@Jhon" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="+91-" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isError !== "" ? <p className="text-red-400 font-semibold text-sm">{isError}</p> : null}
                        <Button
                            type="submit"
                            disabled={saving}
                            className={`mt-5 hover:shadow-md`}
                        >{saving ? "Saving..." : "Save"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}





