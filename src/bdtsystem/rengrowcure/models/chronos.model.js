import mongoose from 'mongoose';

const ChronosLogSchema = new mongoose.Schema({
  logCode: { type: String, required: true, unique: true },
  entityType: { type: String, enum: ['Deal', 'Lead', 'Account', 'Sequence', 'Kinetics'], default: 'Deal' },
  entityId: { type: String, required: true },
  entityTitle: { type: String, required: true },
  activityType: { 
    type: String, 
    enum: ['Stage Transition', 'Outreach Sent', 'Call Completed', 'SLA Warning', 'Escalation', 'Contract Signed'], 
    default: 'Stage Transition' 
  },
  actor: { type: String, default: 'System Agent' },
  summary: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export const ChronosLogModel = mongoose.model('ChronosLog', ChronosLogSchema);
