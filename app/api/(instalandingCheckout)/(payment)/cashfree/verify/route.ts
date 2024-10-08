import { Cashfree } from "cashfree-pg";
import { NextResponse } from "next/server";

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

export const POST = async (req: Request) => {
    try {
        const { orderId } = await req.json();

        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);

        return NextResponse.json({
            success: true,
            data: response.data,
        });
    } catch (error: any) {
        console.error(error?.response?.data?.message || error.message);

        return NextResponse.json({
            success: false,
            message: "Error occurred",
            error: error?.response?.data?.message || error.message,
        }, { status: 500 });
    }
};
