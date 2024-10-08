import mongoose from "mongoose";

const saveOfferSchema = new mongoose.Schema({
    email_phone: {
        type: String
    },
    product_url: {
        type: String
    },
    offer_id: {
        type: String
    },
    name: {
        type: String
    },
}, { timestamps: true });

const SaveOffer = mongoose.models.SaveOffer || mongoose.model('SaveOffer', saveOfferSchema);

export default SaveOffer;
