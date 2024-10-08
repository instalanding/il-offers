import { NextResponse } from "next/server";
import QRCode from "qrcode";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const offer_id = searchParams.get("offer_id");
    const coupon_code = searchParams.get("coupon_code");
    const camp_type = searchParams.get("camp_type");
    const redirect_url = searchParams.get("redirect_url") as any;
    try {
        let qrCode;
        if (camp_type === "offline") {
            qrCode = await QRCode.toDataURL(
                `https://dashboard.instalanding.in/verify-coupon?coupon_code=${coupon_code}&offer_id=${offer_id}`
            );
            return NextResponse.json(qrCode);
        } else {
            qrCode = await QRCode.toDataURL(redirect_url);
            return NextResponse.json(qrCode);
        }
    } catch (err) {
        console.error('Error in generating QR Code:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}