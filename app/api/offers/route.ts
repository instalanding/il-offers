import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

export const GET = async (req: Request, res: Response) => {
    // console.log("Hello World");
    const { searchParams } = new URL(req.url);

    const param = searchParams.get("app_id");
    console.log(param, 'hello')

    const client = new MongoClient(process.env.MONGODB_URL as string );
    await client.connect();
    const database = client.db(process.env.DATABASE as string );
    const collection = database.collection('offermappers');
    const campaignsCollection = database.collection('campaigns');

    try {
        const offerMapper = await collection.findOne({ publisher_id: param });

        if (!offerMapper) {
            console.log('mapper not found')
            return NextResponse.json({ error: 'OfferMapper not found' }, { status: 404 });
        }

        const populatedOfferMapper = await collection.aggregate([
            { $match: { publisher_id: param } },
            { $unwind: "$advertisers" },
            {
                $lookup: {
                    from: "campaigns",
                    localField: "advertisers.campaigns",
                    foreignField: "_id",
                    as: "advertisers.campaigns"
                }
            },
            { $group: { _id: "$_id", data: { $first: "$$ROOT" }, advertisers: { $push: "$advertisers" } } },
            { $addFields: { "data.advertisers": "$advertisers" } },
            { $replaceRoot: { newRoot: "$data" } }
        ]).toArray();

        if (populatedOfferMapper.length === 0) {
            return NextResponse.json({ error: 'OfferMapper not found after aggregation' }, { status: 404 });
        }

        console.log(populatedOfferMapper, 'result after aggrgation')

        return NextResponse.json(populatedOfferMapper[0]);
    } catch (err) {
        console.log(err)
        NextResponse.json(err);
    }


}