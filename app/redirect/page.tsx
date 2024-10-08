"use client"

import React, { useEffect } from 'react'
import { redirect } from 'next/navigation'
import axios from 'axios'

// const recordImpressions = async (offer_id: string, advertiser_id: string, redirect_url: string) => {
//     try {
//         const response = await fetch(`${process.env.API_URL}clicks-impressions/?offer_id=${offer_id}&advertiser_id=${advertiser_id}`, { method: "POST" });
//         if (!response.ok) {
//             throw new Error('Failed to record clicks')
//         }

//         return response.json();
//     } catch (error) {
//         console.log(error)
//     }
// }

export default async function Redirect({ searchParams }: any) {
    const { offer_id, advertiser_id, redirect_url } = searchParams
    // try {
    //     await recordImpressions(offer_id, advertiser_id, redirect_url);
    //     redirect(redirect_url)
    // } catch (err) {
    //     console.log(err)
    // }

    const handleRedirect = async () => {
        const reqbody = {
            productUrl: redirect_url,
            advertiser_id: advertiser_id
        }
        try {
            const response = await axios.post(`api/clicks-impressions/?offer_id=${offer_id}`, reqbody);
            console.log(response.status, "status");
        } catch (error) {
            console.error("Error saving the offer:", error);
        } finally {
            window.open(redirect_url, '_blank');
        }
    }

    useEffect(() => {
        handleRedirect()
    }, [])

    return (
        <div>Redirecting...</div>
    )
}
