"use client";

import { useState, useEffect } from "react";
import { load } from '@cashfreepayments/cashfree-js';
import axios from "axios";
import { EventEmitter } from 'events';

EventEmitter.defaultMaxListeners = 20;  // Increase the limit if needed

interface RequestBody {
    customer_id: string;
    customer_phone: string;
    customer_name: string;
    customer_email: string;
    amount: number;
}

const useCashfreePayment = () => {
    const [orderId, setOrderId] = useState<string>("");
    const [cashfree, setCashfree] = useState<any>(null); // State to store cashfree SDK instance

    console.log(orderId, "orderId");

    // Function to load the Cashfree SDK
    const loadCashfreeSDK = async () => {
        const sdk = await load({ mode: "sandbox" });
        setCashfree(sdk); // Store the loaded SDK instance in state
    };

    const getSessionId = async (body: RequestBody) => {
        try {
            const res = await axios.post("api/cashfree/payment", body);
            console.log("API Response:", res.data.data.payment_session_id);
            if (res.data.data && res.data.data.payment_session_id) {
                console.log(res.data.data);
                setOrderId(res.data.data.order_id);
                return res.data.data.payment_session_id;
            } else {
                console.error("No payment_session_id in the response.");
            }
        } catch (error) {
            console.error("Error in getSessionId:", error);
        }
    };

    const verifyPayment = async (orderId: string) => {
        try {
            const res = await axios.post("api/cashfree/verify", { orderId });
            if (res && res.data) {
                alert("Payment verified");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePayment = async (e: any, paymentDetails: RequestBody, offer_id: string) => {
        e.preventDefault();
        try {
            let sessionId = await getSessionId(paymentDetails);
            if (!sessionId) {
                console.error("Failed to retrieve sessionId");
                return;
            }
            console.log(sessionId, "sessionId");
            const checkoutOptions = {
                paymentSessionId: sessionId,
                redirectTarget: `${process.env.NEXT_PUBLIC_CLIENT_URL}${offer_id}`,
            };
            cashfree.checkout(checkoutOptions).then((res: any) => {
                console.log("Payment initialized");
                verifyPayment(orderId);
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Load Cashfree SDK only when the user interacts with the payment process
    useEffect(() => {
        if (cashfree === null) {
            loadCashfreeSDK(); // Load SDK when the hook is first used
        }
    }, [cashfree]);

    return { handlePayment };
};

export default useCashfreePayment;
