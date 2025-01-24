"use client";
import React, { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from 'axios';

type ImpressionsProp = {
    offer_id: string,
    advertiser: string,
    user_ip: string,
    store_url: string,
    tags: any,
    utm_params?: any,
    campaign_id: string,
};

const RecordImpressions = ({ offer_id, advertiser, user_ip, store_url, tags, utm_params, campaign_id }: ImpressionsProp) => {

    const [visitorId, setVisitorId] = useState<string>();

    const getVisitorId = async () => {
        if (typeof window === "undefined") return; // Ensure this code only runs on the client side

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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}analytics/impressions/?offer_id=${offer_id}&advertiser_id=${advertiser}&user_ip=${user_ip}&product_url=${store_url}&tags=${tags}&visitor_id=${visitorId}&utm_source=${utm_params?.utm_source}&utm_medium=${utm_params?.utm_medium}&utm_campaign=${utm_params?.utm_campaign}&campaign_id=${campaign_id}`);
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
