import { fetchApi } from "@/lib/backendFunctions";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const ipFromShopify = searchParams.get("user_ip");
  const userIP = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(
    ","
  )[0];

  try {
    const apiData =
      ipFromShopify && ipFromShopify !== ""
        ? await fetchApi(ipFromShopify)
        : await fetchApi(userIP);


    return NextResponse.json(apiData);
  } catch (error) {
    console.error("Error getting api data", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
