"use client";
import React, { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from 'axios';

type ImpressionsProp = {
    checkoutData: any,
    utm_params?: any,
    userIp: string,
};

const RecordImpressions = ({ checkoutData, userIp, utm_params }: ImpressionsProp) => {

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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}analytics/impressions/?offer_id=${checkoutData.offer_id}&advertiser_id=${checkoutData.advertiser_id}&user_ip=${userIp}&product_url=${checkoutData.store_url}&tags=${checkoutData.tags}&visitor_id=${visitorId}&utm_source=${utm_params?.utm_source}&utm_medium=${utm_params?.utm_medium}&utm_campaign=${utm_params?.utm_campaign}&campaign_id=${checkoutData.campaign_id}`);
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
    }, [visitorId]);

    return null;
};

export default RecordImpressions;
