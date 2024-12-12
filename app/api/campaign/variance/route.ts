import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import campaign from "@/models/campaign";

const THIRTY_MINUTES = 1 * 60 * 1000; // 30 minutes in milliseconds

export const POST = async (req: Request) => {
    const { visitor_id, campaign_id, showDefault, isCheckoutClicked } = await req.json(); 
    
    if (!visitor_id || !campaign_id) {
      return NextResponse.json(
        { error: "visitor_id and campaign_id are required" },
        { status: 400 }
      );


    }
  
    
    try {
      const client = new MongoClient(process.env.MONGODB_URL as string);
      await client.connect();
      const database = client.db(process.env.DATABASE as string);
      const userVarianceCollection = database.collection("userVariance");
      const campaignsCollection = database.collection("campaigns");

      // First, get the campaign to access its generated_html array
      const campaign = await campaignsCollection.findOne({
        _id: new ObjectId(campaign_id)
      });

      // Check if the campaign exists and has generated_html
      if (!campaign) {
        await client.close();
        return NextResponse.json(
          { error: "Campaign not found" },
          { status: 404 }
        );
      }

      // If generated_html is not available, return the default variance
      if (!campaign.generated_html || campaign.generated_html.length === 0) {
        await client.close();
        return NextResponse.json({ 
          variance: null,
          showTerms: true 
        });
      }

      // Using generated_html array as our variances
      const variances = campaign.generated_html;

      // If showDefault is true, return default variance
      if (showDefault) {
        await client.close();
        return NextResponse.json({ 
          variance: campaign.creative.terms_and_conditions || "default variance",
          showTerms: true 
        });
      }

      // Get the user's variance history for this campaign
      const userVariance = await userVarianceCollection.findOne({ 
        visitor_id, 
        campaign_id: new ObjectId(campaign_id)
      });

      // If user has clicked checkout before, always show that variance
      if (userVariance?.checkout_clicked) {
        await client.close();
        return NextResponse.json({
          variance: userVariance.last_variance,
          showTerms: false
        });
      }

      let nextVariance;
      let shouldUpdate = false;
      const currentTime = new Date().getTime();

      // For new visitors
      if (!userVariance) {
        // Get the last assigned variance for this campaign
        const lastAssignedVariance = await userVarianceCollection
          .find({ campaign_id: new ObjectId(campaign_id) })
          .sort({ _id: -1 })
          .limit(1)
          .toArray();

        if (lastAssignedVariance.length === 0) {
          // First ever visitor for this campaign
          nextVariance = variances[0];
        } else {
          // Get the index of the last assigned variance
          const lastIndex = variances.indexOf(lastAssignedVariance[0].last_variance);
          // Assign the next variance in sequence
          nextVariance = variances[(lastIndex + 1) % variances.length];
        }
        shouldUpdate = true;
      } 
      // For returning visitors
      else {
        const lastUpdatedTime = new Date(userVariance.last_updated).getTime();
        const timeDifference = currentTime - lastUpdatedTime;

        // If 30 minutes haven't passed, show the same variance
        if (timeDifference < THIRTY_MINUTES) {
          nextVariance = userVariance.last_variance;
          shouldUpdate = false;
        } 
        // If 30 minutes have passed, show the next variance
        else {
          const currentIndex = variances.indexOf(userVariance.last_variance);
          nextVariance = variances[(currentIndex + 1) % variances.length];
          shouldUpdate = true;
        }
      }

      // Update the database if needed
      if (shouldUpdate || isCheckoutClicked) {
        await userVarianceCollection.updateOne(
          { 
            visitor_id, 
            campaign_id: new ObjectId(campaign_id)
          },
          { 
            $set: { 
              last_variance: nextVariance,
              checkout_clicked: isCheckoutClicked === true,
              last_updated: new Date()
            }
          },
          { upsert: true }  
        );
      }

      await client.close();

      return NextResponse.json({ 
        variance: nextVariance,
        showTerms: false
      });
    } catch (error) {
      console.error("Error retrieving variance data:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
};