import mongoose from 'mongoose';

const SocialIntegrationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  platform: { type: String, required: true, enum: ['Facebook', 'Google', 'Instagram', 'LinkedIn', 'Pinterest', 'TikTok', 'Twitter (v2)', 'YouTube'] },
  provider_config_key: { type: String, required: true },
  connection_id: { type: String, required: true },
  account_name: { type: String, default: 'Connected Account' },
  connected_date: { type: Number, default: () => Date.now() },
  followers_count: { type: Number, default: 0 },
  engagement_rate: { type: Number, default: 0 },
  posts_count: { type: Number, default: 0 },
  avg_likes_per_post: { type: Number, default: 0 },
  avg_comments_per_post: { type: Number, default: 0 },
  avg_shares_per_post: { type: Number, default: 0 },
  last_post_date: { type: Number },
  connected_by: { type: String, default: 'Current User' },
  status: { type: String, required: true, enum: ['Connected', 'Disconnected', 'Expired', 'Error'], default: 'Connected' },
  auto_posting_enabled: { type: Boolean, default: true },
  notes: { type: String }
}, { timestamps: true });

export const SocialIntegrationModel = mongoose.model('SocialIntegration', SocialIntegrationSchema);