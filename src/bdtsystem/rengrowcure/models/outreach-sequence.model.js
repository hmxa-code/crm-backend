import mongoose from 'mongoose';

const SequenceSchema = new mongoose.Schema({
  sequenceCode: { type: String, required: true, unique: true },
  sequenceName: { type: String, required: true },
  targetAudience: { type: String, default: 'Clinical Decision Makers' },
  status: { type: String, enum: ['Active', 'Draft', 'Paused', 'Archived'], default: 'Draft' },
  stepsCount: { type: Number, default: 4 },
  steps: [{
    stepNumber: { type: Number, required: true },
    channel: { type: String, enum: ['Email', 'Phone Call', 'LinkedIn Touch', 'SMS', 'Clinical Whitepaper'], default: 'Email' },
    delayDays: { type: Number, default: 2 },
    subject: { type: String },
    bodyTemplate: { type: String }
  }],
  enrolledCount: { type: Number, default: 0 },
  replyRate: { type: Number, default: 0 },
  openRate: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 }
}, { timestamps: true });

export const SequenceModel = mongoose.model('Sequence', SequenceSchema);
