import { Cashfree } from "cashfree-pg";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

export const POST = async (req: Request) => {
  const { customer_id, customer_phone, customer_name, customer_email, amount } = await req.json();
  const order_id = `${uuidv4().replace(/-/g, "").substring(0, 12)}`;

  try {
    let request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: order_id,
      customer_details: {
        customer_id: customer_id,
        customer_phone: customer_phone,
        customer_name: customer_name,
        customer_email: customer_email,
      },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);

    // console.log(response)

    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Error:", error?.response?.data?.message || error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Error occurred",
        error: error?.response?.data?.message || error.message,
      },
      { status: 500 }
    );
  }
};
