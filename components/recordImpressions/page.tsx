"use client";
import React, { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from 'axios';

type ImpressionsProp = {
    checkoutData: any,
};

const RecordImpressions = ({ checkoutData }: ImpressionsProp) => {

    const [visitorId, setVisitorId] = useState<string>();

    const getVisitorId = async () => {
        if (typeof window === "undefined") return;

        try {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setVisitorId(result.visitorId);
        } catch (error) {
            console.error("Error getting visitor identifier:", error);
            return null;
        }
    };

    const impressions = async () => {
        try {
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}analytics/impressions/?offer_id=${checkoutData.offer_id}&advertiser_id=${checkoutData.advertiser_id}&user_ip=${checkoutData.userIp}&product_url=${checkoutData.store_url}&tags=${checkoutData.tags}&visitor_id=${visitorId}&utm_source=${checkoutData.utm_params?.utm_source}&utm_medium=${checkoutData.utm_params?.utm_medium}&utm_campaign=${checkoutData.utm_params?.utm_campaign}&campaign_id=${checkoutData.campaign_id}`);
        } catch (error) {
            console.error("Error recording impressions:", error);
        }
    };

    useEffect(() => {
        getVisitorId();
    }, []);

    useEffect(() => {
        if (visitorId) {
            impressions();
        }
    }, [visitorId, impressions, checkoutData]);

    return null;
};

export default RecordImpressions;
