import axios from "axios";

const clientId = process.env.NEXT_PUBLIC_OTPLESS_CLIENT_ID
const clientSecret = process.env.NEXT_PUBLIC_OTPLESS_CLIENT_SECRET
const otplessEndpoint = process.env.NEXT_PUBLIC_OTPLESS_ENDPOINT

export const handleSendOtp = async (phoneNumber: string) => {
    const options = {
        headers: {
            clientId: clientId,
            clientSecret: clientSecret,
            'Content-Type': 'application/json',
        },
    };
    const body = {
        phoneNumber: `+91${phoneNumber}`,
        expiry: 30,
        otpLength: 4,
        channels: ["SMS"],
        metaData: {
            key1: "instalanding",
            key2: "phoneAuth",
        },
    };

    try {
        const response = await axios.post(
            `${otplessEndpoint}initiate/otp`,
            body,
            options
        );
        // console.log(response.data);
        return response.data
    } catch (error: any) {
        console.error('Error initiating OTP:', error.response ? error.response.data : error.message);
        return error;
    }
};

export const handleVerifyOtp = async (otp: string, requestId: string) => {
    const options = {
        headers: {
            clientId: clientId,
            clientSecret: clientSecret,
            'Content-Type': 'application/json',
        },
    };
    const body = { requestId, otp }
    try {
        const response = await axios.post(
            `${otplessEndpoint}verify/otp`,
            body,
            options
        );
        return response.data
    } catch (error: any) {
        console.error('Error initiating OTP:', error.response ? error.response.data : error.message);
        return error;
    }
}