import mongoose from 'mongoose';

const SocialPostSchema = new mongoose.Schema({
  platform: { type: String, required: true, enum: ['Facebook', 'Google', 'Instagram', 'LinkedIn', 'Pinterest', 'TikTok', 'Twitter (v2)', 'YouTube'] },
  campaign_name: { type: String, required: true },
  content: { type: String, required: true },
  scheduled_date: { type: Number, required: true },
  published_date: { type: Number },
  status: {
    type: String,
    required: true,
    enum: ['Draft', 'Scheduled', 'Published', 'Failed', 'Archived'],
    default: 'Draft',
  },
  target_audience: { type: String },
  created_by: { type: String, default: 'Current User' },
  engagement: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },
  notes: { type: String },
}, { timestamps: true });

export const SocialPostModel = mongoose.model('SocialPost', SocialPostSchema);
