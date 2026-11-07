import mongoose from 'mongoose';

const LeadScoreSchema = new mongoose.Schema({
  lead_id: { type: String, required: true },
  lead_name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  engagement_score: { type: Number, default: 0 },
  behavioral_score: { type: Number, default: 0 },
  demographic_score: { type: Number, default: 0 },
  total_score: { type: Number, default: 0 },
  grade: { type: String, required: true, enum: ['A', 'B', 'C', 'D', 'F'], default: 'C' },
  status: { type: String, required: true, enum: ['Hot', 'Warm', 'Cold', 'Inactive'], default: 'Cold' },
  last_activity: { type: Number },
  activities_count: { type: Number, default: 0 },
  email_opens: { type: Number, default: 0 },
  link_clicks: { type: Number, default: 0 },
  page_views: { type: Number, default: 0 },
  form_submissions: { type: Number, default: 0 },
  updated_by: { type: String, default: 'Current User' },
  notes: { type: String }
}, { timestamps: true });

export const LeadScoreModel = mongoose.model('LeadScore', LeadScoreSchema);