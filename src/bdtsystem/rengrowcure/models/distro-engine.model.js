import mongoose from 'mongoose';

const DistroRuleSchema = new mongoose.Schema({
  ruleCode: { type: String, required: true, unique: true },
  ruleName: { type: String, required: true },
  routingStrategy: { 
    type: String, 
    enum: ['Round-Robin', 'Territory-Based', 'Specialty-Matched', 'Capacity-Balanced', 'Load-Optimized'],
    default: 'Round-Robin'
  },
  priorityLevel: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  assignedAgents: [{ type: String }],
  matchCriteria: {
    minScore: { type: Number, default: 0 },
    territory: { type: String, default: 'All' },
    specialty: { type: String, default: 'All' }
  },
  totalProcessedCount: { type: Number, default: 0 },
  lastTriggeredAt: { type: Date }
}, { timestamps: true });

export const DistroRuleModel = mongoose.model('DistroRule', DistroRuleSchema);
