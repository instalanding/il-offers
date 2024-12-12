import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  try {
    const client = new MongoClient(process.env.MONGODB_URL as string);
    await client.connect();
    const database = client.db(process.env.DATABASE as string);
    
    const collection = database.collection('reviews');

    await collection.createIndex({ offer_id: 1 });
    await collection.createIndex({ review_id: 1 });
    await collection.createIndex({ review_date: 1 });
    await collection.createIndex({ review_rating: 1 });
    await collection.createIndex({ review_curated: 1 });

    const query = Object.fromEntries(searchParams.entries());

    const totalReviews = await collection.countDocuments(query);

    const reviews = await collection.aggregate([
      { $match: query },
      { $group: { _id: "$reviewer_name", doc: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } },
      { $project: {
          reviewer_name: 1,
          review_rating: 1,
          review_body_text: 1,
          review_media: 1,
          review_date: 1
      }},
      { $sort: { review_date: -1 } },
      { $limit: 5 }
    ]).toArray();

    await client.close();
    return NextResponse.json({ totalReviews, topReviews: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
};
