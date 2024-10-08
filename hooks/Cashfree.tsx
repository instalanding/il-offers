"use client";

import { useState } from "react";
import { load } from '@cashfreepayments/cashfree-js';
import axios from "axios";
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;  // Increase the limit to 20 or more if needed

interface RequestBody {
    customer_id: string,
    customer_phone: string,
    customer_name: string,
    customer_email: string,
    amount: number
}

const useCashfreePayment = () => {
    const [orderId, setOrderId] = useState<string>("");
    let cashfree: any;

    console.log(orderId, "orderId")

    let insitialzeSDK = async function () {

        cashfree = await load({
            mode: "sandbox",
        })
    }

    insitialzeSDK()

    const getSessionId = async (body: RequestBody) => {
        try {
            const res = await axios.post("api/cashfree/payment", body);
            console.log("API Response:", res.data.data.payment_session_id);  // Add this log
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
            let res = await axios.post("api/cashfree/verify", {
                orderId: orderId
            })
            if (res && res.data) {
                alert("payment verified")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePayment = async (e: any, paymentDetails: RequestBody, offer_id: string) => {
        e.preventDefault();
        try {
            let sessionId = await getSessionId(paymentDetails);
            if (!sessionId) {
                console.error("Failed to retrieve sessionId");
                return;
            }
            console.log(sessionId, "sessionId")
            let checkoutOptions = {
                paymentSessionId: sessionId,
                redirectTarget: `${process.env.NEXT_PUBLIC_CLIENT_URL}${offer_id}`,
            }
            cashfree.checkout(checkoutOptions).then((res: any) => {
                console.log("payment initialized")
                verifyPayment(orderId)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return { handlePayment }
};

export default useCashfreePayment;
