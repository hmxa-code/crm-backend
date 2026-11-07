import mongoose from 'mongoose';

const KineticsActionSchema = new mongoose.Schema({
  actionCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  actionType: { 
    type: String, 
    enum: ['Escalation Trigger', 'Auto Follow-Up', 'SLA Recovery', 'Owner Rebalance', 'Approval Required'],
    default: 'SLA Recovery'
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Dismissed'], default: 'Pending' },
  assignedTo: { type: String, default: 'Account Executive' },
  targetEntity: {
    entityType: { type: String, default: 'Opportunity' },
    entityId: { type: String },
    entityName: { type: String }
  },
  dueDate: { type: String },
  resolutionNotes: { type: String }
}, { timestamps: true });

export const KineticsActionModel = mongoose.model('KineticsAction', KineticsActionSchema);
