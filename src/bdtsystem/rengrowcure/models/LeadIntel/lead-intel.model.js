import mongoose from 'mongoose';

const LeadIntelSchema = new mongoose.Schema({
  modelId: { type: String, required: true, unique: true },
  profileName: { type: String, required: true },
  targetTier: { type: String, enum: ['Enterprise', 'Mid-Market', 'SMB', 'Strategic'], required: true },
  weights: {
    fb: { type: Number, default: 10 },
    linkedin: { type: Number, default: 30 },
    demo: { type: Number, default: 35 },
    email: { type: Number, default: 15 },
    webinar: { type: Number, default: 20 },
    websiteVisits: { type: Number, default: 15 }
  },
  mqlThreshold: { type: Number, default: 65 },
  sqlThreshold: { type: Number, default: 85 },
  maxScore: { type: Number, default: 100 },
  status: { type: String, enum: ['Active', 'Draft', 'Deprecated'], default: 'Draft' },
  evaluationCount: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 },
  lastUpdated: { type: String, default: 'Just now' }
}, { timestamps: true });

export const LeadIntelModel = mongoose.model('LeadIntel', LeadIntelSchema);
