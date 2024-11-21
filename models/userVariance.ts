import mongoose, { Types } from 'mongoose';

const userVarianceSchema = new mongoose.Schema({
  visitor_id: {
    type: String,
    required: true,
  },
  campaign_id: {
    type: Types.ObjectId,
    required: true,
    ref: 'Campaign'
  },
  last_variance: {
    type: String,
    required: true,
  },
  checkout_clicked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const UserVariance = mongoose.models.UserVariance || mongoose.model("UserVariance", userVarianceSchema);

export default UserVariance;