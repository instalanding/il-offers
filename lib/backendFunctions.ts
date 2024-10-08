import axios from "axios";

export const parseIp = (req: any) =>
    req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;

export const fetchApi = async (userIP:string) => {
    try {
        const response = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key==21d8f763805b42139f1cb83fb37bbe1b&ip_address=${userIP}`);
        return response.data;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to fetch IP data');
    }
};