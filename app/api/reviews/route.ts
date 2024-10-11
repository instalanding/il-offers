import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const offer_id = searchParams.get("offer_id");

  try {
    const client = new MongoClient(process.env.MONGODB_URL as string);
    await client.connect();
    const database = client.db(process.env.DATABASE as string);
    const collection = database.collection('reviews');

    const reviews = await collection.find({ offer_id }).toArray();
    await client.close();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
};