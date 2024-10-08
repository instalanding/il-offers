import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Image from 'next/image'
import ProductCard from './ProductCard'

interface AccordionProp {
    appId: string
}

const getOffers = async (appId: string) => {
    try {
        const response = await fetch(`${process.env.API_URL}offers/?app_id=${appId}`, { cache: 'no-store' });
        console.log(response, 'response in the frontend')
        if (!response.ok) {
            throw new Error('Failed to fetch offers')
        }
        return response.json();
    } catch (error) {
        console.log(error)
    }
}


const Accordions = async ({ appId }: AccordionProp) => {
    const data = await getOffers(appId)
    const firstAdvertiserId = data?.advertisers?.length > 0 ? data.advertisers[0].advertiser_id : null;
    return (
        <div className='my-[40px] w-full'>
            <Accordion type="single" collapsible={true} className="w-full flex flex-col gap-2" defaultValue={firstAdvertiserId}>
                {
                    data?.advertisers?.length > 0 && data?.advertisers.map((offer: any, i:any) => (
                        <AccordionItem value={offer.advertiser_id} key={offer.advertiser_id}>
                            <AccordionTrigger className="px-4 w-full">
                                <div className="flex items-center gap-[90px] w-full">
                                    <Image
                                        alt={offer.advertiser_name || "logo"}
                                        src={offer.store_logo}
                                        width={50}
                                        height={50}
                                        className='min-w-[50px] h-[50px]'
                                    />
                                    <h4 className="font-bold">{offer.advertiser_name}</h4>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="overflow-x-scroll flex mt-2 gap-3 hide-scrollbar-x w-full p-2">
                                {
                                    offer.campaigns.map((campaign: any) => (
                                        <ProductCard campaign={campaign} key={campaign._id} />
                                    ))
                                }
                            </AccordionContent>
                        </AccordionItem>
                    ))
                }
            </Accordion>
        </div>
    )
}

export default Accordions