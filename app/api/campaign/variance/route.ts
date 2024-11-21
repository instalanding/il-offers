import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

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
  
      // Check if user has a locked variance
      const lockedVariance = await userVarianceCollection.findOne({
        visitor_id,
        checkout_clicked: true
      });

      if (lockedVariance) {
        await client.close();
        return NextResponse.json({
          variance: lockedVariance.last_variance,
          showTerms: false
        });
      }

      // Get the user's variance history for this campaign
      const userVariance = await userVarianceCollection.findOne({ 
        visitor_id, 
        campaign_id: new ObjectId(campaign_id)
      });
      
      let nextVariance;
      let shouldUpdate = false;

      // If checkout is clicked, lock this variance for the user
      if (isCheckoutClicked === true) {
        nextVariance = userVariance?.last_variance || variances[0];
        shouldUpdate = true;
      }
      // For new visitors
      else if (!userVariance) {
        // Get count of all records to determine starting point
        const totalRecords = await userVarianceCollection.countDocuments();
        nextVariance = variances[totalRecords % variances.length];
        shouldUpdate = true;
      }
      // For returning visitors
      else {
        const currentIndex = variances.indexOf(userVariance.last_variance);
        const nextIndex = (currentIndex + 1) % variances.length;
        nextVariance = variances[nextIndex];
        shouldUpdate = true;
      }
  
      // Update the database if needed
      if (shouldUpdate) {
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