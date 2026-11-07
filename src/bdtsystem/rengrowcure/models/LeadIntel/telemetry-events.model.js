import mongoose from 'mongoose';

const TelemetryEventSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  leadName: { type: String, required: true },
  leadCompany: { type: String, required: true },
  eventType: { 
    type: String, 
    enum: ['Form Submit', 'Demo Booked', 'LinkedIn Click', 'Page Visit', 'Whitepaper Download'],
    required: true
  },
  scoreDelta: { type: Number, required: true },
  resultingScore: { type: Number, required: true },
  appliedModel: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Qualified', 'Evaluating', 'Nurturing', 'Auto-Promoted'],
    required: true
  },
  latencyMs: { type: Number, required: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  modelId: { type: String, ref: 'LeadIntel' }
}, { timestamps: true });

TelemetryEventSchema.index({ timestamp: -1 });
TelemetryEventSchema.index({ leadId: 1, timestamp: -1 });
TelemetryEventSchema.index({ appliedModel: 1 });

export const TelemetryEventModel = mongoose.model('TelemetryEvent', TelemetryEventSchema);