import mongoose from "mongoose";

const creativesSchemaNew = new mongoose.Schema({
    images: [String],
    coupon_code: {
      type: String,
    },
    price: {
      original_price: Number,
      offer_price: Number,
      currency: { type: String, default: "" },
    },
    display_content: {
      timer_text: {
        type: String,
        default: "Timer text",
      },
      promo_title: {
        type: String,
        default: "Promo title here",
      },
    },
    product_title: String,
    offer_title: String,
    offer_text: String,
    product_page_url: String,
    product_description: String,
    variant_id: String,
    brand_icon: String,
  });
  
  const configSchema = new mongoose.Schema({
    button1Text: {
      type: String,
      default: "Save Offer",
    },
    button1Color: {
      type: String,
      default: "#188bcd",
    },
    button1TextColor: {
      type: String,
      default: "#ffff",
    },
    button2Text: {
      type: String,
      default: "Buy Now",
    },
    button2Color: {
      type: String,
      default: "#f09609",
    },
    button2TextColor: {
      type: String,
      default: "#ffff",
    },
    timerBackgroundColor: {
      type: String,
      default: "#188bcd",
    },
    timerTextColor: {
      type: String,
      default: "#ffff",
    },
    backgroundColor: {
      type: String,
      default: "#fff",
    },
    textColor: {
      type: String,
      default: "#000",
    },
  });
  
  const campiagnSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    instalanding_app_id: String,
    instalanding_platform_user_id: String,
    instalanding_platform_user_email: String,
    campaign_id: String,
    campaign_name: String,
    shop_id: String,
    status: String,
    lastModifiedAt: { type: Date, default: Date.now },
    lastModifiedBy: String,
    creatives: [creativesSchemaNew],
    campaign_start_date: Date,
    campaign_end_date: Date,
    campaign_budget: {
      currency: String,
      value: Number,
    },
    config: {
      type: configSchema,
    },
    commission: Number,
    store_description: String,
    store_logo: String,
    store_url: String,
    image_url: String,
    campaign_type: {
      type: String,
      enum: ["firstParty", "thirdParty"],
    },
    campaign_content: {
      type: String,
      enum: ["instalanding", "manually"],
      default: "instalanding",
    },
  });
  
  const campaign = mongoose.models.campaigns || mongoose.model("campaigns", campiagnSchema);
  
  export default campaign;