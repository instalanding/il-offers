
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default function Reedem({ data, offer_id, userIp }: any) {

    const redirectUrl = `https://links.instalanding.in/redirect/?offer_id=${offer_id}&advertiser_id=${data.advertiser}&tags=${data?.tags}&redirect_url=${data?.campaign_type !== "offline" ? data?.store_url : `https://vri.li/${offer_id}`}`
    return (
        <>
            <Link href={redirectUrl} target='_blank'>
                <Button
                    style={{ backgroundColor: data?.config?.button1Color, color: data?.config?.button1TextColor }}
                    className={`mt-5 bg-[${data?.config?.button1Color}] text-[${data?.config?.button1TextColor}] hover:bg-[#2D0B48] hover:shadow-md`}>
                    {data?.config?.button1Text}
                </Button>
            </Link>

        </>
    )
}
