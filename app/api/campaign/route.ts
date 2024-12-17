import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const variant_id = searchParams.get("variant_id");
console.log("slug",slug)
console.log("variant_id",variant_id)
  if (!slug) {
    return NextResponse.json(
      { error: "Slug query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URL as string);
    await client.connect();
    const database = client.db(process.env.DATABASE as string);
    const campaignsCollection = database.collection("campaigns");
    const advertisersCollection = database.collection("advertisers");


    const allCampaigns = await campaignsCollection
      .find({ product_handle: slug })
      .toArray();

      console.log("allCampaigns------", allCampaigns)
    // Sort campaigns based on offer price
    const sortedCampaigns = allCampaigns.sort((a, b) => {
      const offerPriceA = parseFloat(a.price.offerPrice.value);
      const offerPriceB = parseFloat(b.price.offerPrice.value);
      return offerPriceA - offerPriceB; 
    });

    // Ensure campaign is always a single document
    const campaign = variant_id
      ? sortedCampaigns.find((m) => m.variant_id === variant_id)
      : sortedCampaigns[0];

    if (!campaign) {
      await client.close();
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Find the advertiser's store logo
    const advertiserId = new ObjectId(campaign.advertiser);
    const advertiser = await advertisersCollection.findOne({
      _id: advertiserId,
    });

    await client.close();

    if (!advertiser) {
      return NextResponse.json(
        { error: "Advertiser not found" },
        { status: 404 }
      );
    }

    // Include the store logo in the response
    campaign.store_logo = advertiser.store_logo;
    campaign.store_url = advertiser.shop_url;
    campaign.domains = advertiser.domains;

    campaign.all_campaigns = sortedCampaigns.map((c) => {
      const { _id, campaign_name, store_logo, store_url, ...rest } = c;
      return { _id, campaign_name, store_logo, store_url, ...rest };
    });

    if (advertiser.checkout) {
      campaign.checkout = advertiser.checkout;
    }
    if (advertiser.pixel) {
      campaign.pixel = advertiser.pixel;
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error retrieving campaign data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
