import mongoose from "mongoose";

const advertiserSchema = new mongoose.Schema({
    advertiser_id: {
        type: mongoose.Types.ObjectId,
        ref: "advertisers",
        required: true,
    },
    store_logo: {
        type: String,
        default: ""
    },
    advertiser_name: {
        type: String,
    },
    campaigns: [{
        type: mongoose.Types.ObjectId,
        ref: "campaigns",
        required: true,
    }]
}, { _id: false })

const offerMapper = new mongoose.Schema({
    publisher_id: String,
    advertisers: [advertiserSchema]
}, { timestamps: true });

const OfferMapper = mongoose.model("OfferMapper", offerMapper);

export default OfferMapper;
