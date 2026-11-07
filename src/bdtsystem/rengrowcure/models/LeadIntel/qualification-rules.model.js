import mongoose from 'mongoose';

const QualificationRuleSchema = new mongoose.Schema({
  ruleCode: { type: String, required: true },
  name: { type: String, required: true },
  fromStage: { type: String, enum: ['Cold', 'Warm', 'MQL'], required: true },
  toStage: { type: String, enum: ['Warm', 'MQL', 'SQL'], required: true },
  conditionField: { type: String, required: true },
  operator: { 
    type: String, 
    enum: ['greater_than', 'equals', 'less_than', 'contains', 'in_range'],
    required: true
  },
  value: mongoose.Schema.Types.Mixed,
  autoAction: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 }
}, { timestamps: true });

QualificationRuleSchema.index({ ruleCode: 1, isActive: 1 });
QualificationRuleSchema.index({ priority: 1 });

export const QualificationRuleModel = mongoose.model('QualificationRule', QualificationRuleSchema);