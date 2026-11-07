import mongoose from 'mongoose';

/**
 * Enterprise Drip Campaign Model
 * Decoupled: Step sequencing, branching decisions, and execution triggers
 * are handled through the central Workflow Engine.
 */
const DripStepSchema = new mongoose.Schema({
  id: { type: String },
  order: { type: Number, required: true },
  delayLabel: { type: String, default: 'Immediately' },
  delayHours: { type: Number, default: 0 },
  actionType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String },
  tagName: { type: String },
  telemetry: {
    delivered: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    converted: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  }
}, { _id: false });

const DripCampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  campaign_name: { type: String },
  description: { type: String },
  triggerType: { 
    type: String, 
    required: true, 
    enum: ['Time-Based', 'Event-Based', 'Behavior-Based'], 
    default: 'Behavior-Based' 
  },
  triggerDetail: { type: String },
  targetPersona: { type: String, default: 'Target Leads' },
  goal: { type: String },
  notes: { type: String },
  status: { 
    type: String, 
    required: true, 
    enum: ['Active', 'Paused', 'Completed', 'Draft'], 
    default: 'Draft' 
  },
  owner: { type: String, default: 'Growth Team' },
  created_by: { type: String, default: 'Growth Team' },

  // Decoupled linkage: Reference to Central CRM Workflow Automation
  workflow_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workflow',
    default: null
  },

  enrollmentRules: [{
    id: { type: String },
    field: { type: String },
    operator: { type: String },
    value: { type: String }
  }],
  steps: [DripStepSchema],
  telemetry: {
    totalEnrolled: { type: Number, default: 0 },
    activeLeads: { type: Number, default: 0 },
    completedLeads: { type: Number, default: 0 },
    unsubscribedLeads: { type: Number, default: 0 },
    bounced: { type: Number, default: 0 },
    overallConversionRate: { type: Number, default: 0 }
  }
}, { timestamps: true });

export const DripCampaignModel = mongoose.model('DripCampaign', DripCampaignSchema);
