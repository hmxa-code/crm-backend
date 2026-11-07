import mongoose from 'mongoose';

const WorkflowSchema = new mongoose.Schema({
  workflow_name: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true, enum: ['Active', 'Paused', 'Draft', 'Completed'], default: 'Draft' },
  trigger_type: { type: String, required: true, enum: ['Lead-Creation', 'Form-Submission', 'Tag-Added', 'Time-Based', 'Custom', 'Opportunity-Stage-Changed'] },
  action_type: { type: String, required: true, enum: ['Email', 'SMS', 'Task', 'Tag', 'Multi-Step'] },
  total_contacts: { type: Number, default: 0 },
  processed_contacts: { type: Number, default: 0 },
  successful_actions: { type: Number, default: 0 },
  failed_actions: { type: Number, default: 0 },
  automation_efficiency: { type: Number, default: 0 },
  created_by: { type: String, default: 'Current User' },
  created_date: { type: Number, required: true },
  last_executed: { type: Number },
  notes: { type: String }
}, { timestamps: true });

export const WorkflowModel = mongoose.model('Workflow', WorkflowSchema);