import mongoose from 'mongoose';

const VentureMatrixDealSchema = new mongoose.Schema({
  dealCode: { type: String, required: true, unique: true },
  accountName: { type: String, required: true },
  dealTitle: { type: String, required: true },
  ownerName: { type: String, required: true, default: 'Account Executive' },
  ownerAvatar: { type: String, default: 'AE' },
  stage: { 
    type: String, 
    required: true, 
    enum: ['Discovery', 'Value Prop', 'Proposal', 'Contract', 'Closed Won', 'Closed Lost'],
    default: 'Discovery'
  },
  amount: { type: Number, required: true, default: 0 },
  mrr: { type: Number, default: 0 },
  arr: { type: Number, default: 0 },
  closeProbability: { type: Number, default: 20, min: 0, max: 100 },
  expectedCloseDate: { type: String, default: '' },
  stagnationDays: { type: Number, default: 0 },
  slaBreachRisk: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Low' 
  },
  healthScore: { type: Number, default: 85, min: 0, max: 100 },
  lastTouchpoint: { type: String, default: 'Opportunity initiated' },
  primaryContact: { type: String, default: '' },
  industry: { type: String, default: 'Healthcare Enterprise' },
  notes: { type: String, default: '' },
  createdBy: { type: String, default: 'Current User' }
}, { timestamps: true });

export const VentureMatrixDealModel = mongoose.model('VentureMatrixDeal', VentureMatrixDealSchema);
