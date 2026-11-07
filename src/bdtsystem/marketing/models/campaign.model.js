import mongoose from 'mongoose';

/**
 * Enterprise Campaign Model
 * Simplified & decoupled: Internal automation logic is strictly handled by central Workflows.
 */
const CampaignSchema = new mongoose.Schema({
  campaign_name: { type: String, required: true },
  campaign_type: { 
    type: String, 
    required: true, 
    enum: ['Email', 'SMS', 'Social', 'Push', 'Multi-Channel'] 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['Draft', 'Scheduled', 'Active', 'Completed', 'Paused'], 
    default: 'Draft' 
  },
  start_date: { type: Number, required: true },
  end_date: { type: Number },
  target_audience: { type: String, default: 'General Audience' },
  target_count: { type: Number, default: 0 },
  budget: { type: Number, default: 0 },
  notes: { type: String },
  utm_source: { type: String, default: 'crm_marketing' },
  utm_medium: { type: String },
  utm_campaign: { type: String },
  
  // Decoupled linkage: Reference to Central CRM Workflow Automation
  workflow_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workflow',
    default: null
  },

  // Read-only Telemetry Metrics (Calculated via event delivery ingestion)
  recipient_count: { type: Number, default: 0 },
  open_rate: { type: Number, default: 0 },
  click_rate: { type: Number, default: 0 },
  conversion_rate: { type: Number, default: 0 },
  bounced_count: { type: Number, default: 0 },
  unsubscribed_count: { type: Number, default: 0 },
  created_by: { type: String, default: 'Growth Team' }
}, { timestamps: true });

export const CampaignModel = mongoose.model('Campaign', CampaignSchema);
