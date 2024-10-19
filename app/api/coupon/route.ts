import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from 'mongodb';
import { v4 as uuidv4 } from "uuid";
import { pool } from "@/lib/postgres";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const offerId = searchParams.get("offer_id");

    if (!offerId) {
        return NextResponse.json({ error: 'offer_id query parameter is required' }, { status: 400 });
    }

    try {
        const client = new MongoClient(process.env.MONGODB_URL as string);
        await client.connect();
        const database = client.db(process.env.DATABASE as string);
        const campaignsCollection = database.collection('campaigns');
        const advertisersCollection = database.collection('advertisers');

        // Find the campaign
        const campaign = await campaignsCollection.findOne({ offer_id: offerId });

        if (!campaign) {
            await client.close();
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }

        // Find the advertiser's store logo
        const advertiserId = new ObjectId(campaign.advertiser);
        const advertiser = await advertisersCollection.findOne({ _id: advertiserId });

        await client.close();

        if (!advertiser) {
            return NextResponse.json({ error: 'Advertiser not found' }, { status: 404 });
        }

        // Include the store logo in the response
        campaign.store_logo = advertiser.store_logo;
        campaign.store_url = advertiser.shop_url;
        if(advertiser.checkout){
            campaign.checkout = advertiser.checkout;
        }
        if(advertiser.pixel){
            campaign.pixel = advertiser.pixel
        }

        return NextResponse.json(campaign);
    } catch (error) {
        console.error('Error retrieving campaign data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};


export const POST = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const offer_id = searchParams.get("offer_id");
    const advertiser_id = searchParams.get("advertiser_id");
    const date = new Date();

    const coupon_code = `${uuidv4().replace(/-/g, "").substring(0, 6).toUpperCase()}`;
    const query =
        `INSERT INTO coupons( 
            coupon_code, 
            offer_id, 
            advertiser_id, 
            verified, 
            created_at 
        ) VALUES ( $1, $2, $3, $4, $5 )`;
    const values = [coupon_code, offer_id, advertiser_id, false, date];
    const result = await pool.query(query, values);
    const savedData = await pool.query(
        "SELECT * FROM coupons WHERE coupon_code = $1",
        [coupon_code]
    );
    return NextResponse.json(savedData.rows[0].coupon_code);
}