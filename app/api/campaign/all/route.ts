import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export const GET = async (req: Request) => {

  try {
    const client = new MongoClient(process.env.MONGODB_URL as string);
    await client.connect();
    const database = client.db(process.env.DATABASE as string);
    const campaignsCollection = database.collection("campaigns");

    // Find all campaigns
    const allCampaigns = await campaignsCollection
      .find()
      .toArray();

    return NextResponse.json(allCampaigns);
  } catch (error) {
    console.error("Error retrieving campaign data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};