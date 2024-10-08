import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");

    const client = new MongoClient(process.env.MONGODB_URL as string);
    await client.connect();
    const database = client.db(process.env.DATABASE as string);
    const collection = database.collection('amazon-reviews');

    const query = productId ? { product_id: productId } : {};
    const reviews = await collection.find(query).limit(5).toArray();
    await client.close();
    return NextResponse.json(reviews);

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
};
