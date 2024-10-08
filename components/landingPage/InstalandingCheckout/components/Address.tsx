"use client"

import { z } from "zod"
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import axios from "axios"

function validatePIN(pin: string) {
    return /^(\d{4}|\d{6})$/.test(pin);
}

const formSchema = z.object({
    pincode: z
        .string()
        .refine(validatePIN, {
            message: "Pincode must be a 4 or 6 digit number",
        }),
    first_name: z.string().min(2).max(20),
    last_name: z.string().min(2).max(20),
    address1: z.string().min(2).max(50),
    address2: z.string().min(2).max(50),
    city: z.string().min(2).max(20),
    state: z.string().min(2).max(20),
    email: z.string().email()
})

const Address = ({ userId, setNewAddress, render, setRender }: any) => {
    const [saving, setSaving] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pincode: "",
            first_name: "",
            last_name: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            email: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setSaving(true)
        try {
            const response = await axios.post(`api/address`, { ...values, user_id: userId });
            console.log(response.data);
            setNewAddress(false);
            setRender(!render)
        } catch (error: any) {
            console.error("Error saving the address:", error);
            console.log(error.response.status, "status");
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-white w-full rounded-xl p-3 text-[13px] mt-4">
            <h2 className="font-semibold">Add shipping address</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs pb-2">Pincode<span className="text-red-400">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Pincode" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs pb-2">First Name<span className="text-red-400">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="First name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs pb-2">Last Name<span className="text-red-400">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Last name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs pb-2">Flat, house number, floor, building<span className="text-red-400">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="address1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs pb-2">Area, street, sector, village<span className="text-red-400">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="address2" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-3">
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs pb-2">State<span className="text-red-400">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="state" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs pb-2">City<span className="text-red-400">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="city" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs pb-2">Email<span className="text-red-400">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={saving} className="w-full" size="sm" type="submit">{saving ? "Saving..." : "Save"}</Button>
                </form>
            </Form>
        </div>
    )
}

export default Address