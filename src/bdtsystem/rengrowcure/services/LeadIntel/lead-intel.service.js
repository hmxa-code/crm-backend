import { LeadIntelModel } from '../../models/LeadIntel/lead-intel.model.js';
import { QualificationRuleModel } from '../../models/LeadIntel/qualification-rules.model.js';
import { TelemetryEventModel } from '../../models/LeadIntel/telemetry-events.model.js';

export const LeadIntelService = {
  async getAll(query = {}) {
    const { page = 1, limit = 50, status } = query;
    const skip = (page - 1) * limit;
    
    const match = {};
    if (status) match.status = status;

    const [total, profiles] = await Promise.all([
      LeadIntelModel.countDocuments(match),
      LeadIntelModel.find(match).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 })
    ]);

    // Map _id to id for frontend compatibility
    const mappedProfiles = profiles.map(p => ({
      _id: p._id,
      id: p._id.toString(),
      modelId: p.modelId,
      profileName: p.profileName,
      targetTier: p.targetTier,
      weights: p.weights,
      mqlThreshold: p.mqlThreshold,
      sqlThreshold: p.sqlThreshold,
      maxScore: p.maxScore,
      status: p.status,
      evaluationCount: p.evaluationCount,
      conversionRate: p.conversionRate,
      lastUpdated: p.lastUpdated,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return {
      data: mappedProfiles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getById(id) {
    const profile = await LeadIntelModel.findById(id).exec();
    if (!profile) return null;
    
    return {
      _id: profile._id,
      id: profile._id.toString(),
      modelId: profile.modelId,
      profileName: profile.profileName,
      targetTier: profile.targetTier,
      weights: profile.weights,
      mqlThreshold: profile.mqlThreshold,
      sqlThreshold: profile.sqlThreshold,
      maxScore: profile.maxScore,
      status: profile.status,
      evaluationCount: profile.evaluationCount,
      conversionRate: profile.conversionRate,
      lastUpdated: profile.lastUpdated,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  },

  async create(data) {
    // Generate clean unique modelId if not provided or empty
    if (!data.modelId) {
      data.modelId = `MODEL-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    const lead = new LeadIntelModel(data);
    const savedLead = await lead.save();
    
    return {
      _id: savedLead._id,
      id: savedLead._id.toString(),
      modelId: savedLead.modelId,
      profileName: savedLead.profileName,
      targetTier: savedLead.targetTier,
      weights: savedLead.weights,
      mqlThreshold: savedLead.mqlThreshold,
      sqlThreshold: savedLead.sqlThreshold,
      maxScore: savedLead.maxScore,
      status: savedLead.status,
      evaluationCount: savedLead.evaluationCount,
      conversionRate: savedLead.conversionRate,
      lastUpdated: savedLead.lastUpdated,
      createdAt: savedLead.createdAt,
      updatedAt: savedLead.updatedAt,
    };
  },

  async update(id, data) {
    const updated = await LeadIntelModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) return null;
    updated.lastUpdated = 'Just now';
    await updated.save();
    
    return {
      _id: updated._id,
      id: updated._id.toString(),
      modelId: updated.modelId,
      profileName: updated.profileName,
      targetTier: updated.targetTier,
      weights: updated.weights,
      mqlThreshold: updated.mqlThreshold,
      sqlThreshold: updated.sqlThreshold,
      maxScore: updated.maxScore,
      status: updated.status,
      evaluationCount: updated.evaluationCount,
      conversionRate: updated.conversionRate,
      lastUpdated: updated.lastUpdated,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  },

  async delete(id) {
    await LeadIntelModel.findByIdAndDelete(id).exec();
    return { success: true };
  },

  async deleteMany(ids = []) {
    await LeadIntelModel.deleteMany({ _id: { $in: ids } }).exec();
    return { success: true, count: ids.length };
  },

  // Qualification Rules Methods
  async getRules() {
    const rules = await QualificationRuleModel.find()
      .sort({ priority: 1, createdAt: -1 })
      .exec();
    
    return {
      data: rules.map(r => ({
        _id: r._id,
        id: r._id.toString(),
        ruleCode: r.ruleCode,
        name: r.name,
        fromStage: r.fromStage,
        toStage: r.toStage,
        conditionField: r.conditionField,
        operator: r.operator,
        value: r.value,
        autoAction: r.autoAction,
        isActive: r.isActive,
        priority: r.priority,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }))
    };
  },

  async createRule(data) {
    if (!data.ruleCode) {
      const count = await QualificationRuleModel.countDocuments();
      data.ruleCode = `RULE-UPG-${String(count + 1).padStart(2, '0')}`;
    }
    const rule = new QualificationRuleModel(data);
    const savedRule = await rule.save();
    
    return {
      _id: savedRule._id,
      id: savedRule._id.toString(),
      ruleCode: savedRule.ruleCode,
      name: savedRule.name,
      fromStage: savedRule.fromStage,
      toStage: savedRule.toStage,
      conditionField: savedRule.conditionField,
      operator: savedRule.operator,
      value: savedRule.value,
      autoAction: savedRule.autoAction,
      isActive: savedRule.isActive,
      priority: savedRule.priority,
      createdAt: savedRule.createdAt,
      updatedAt: savedRule.updatedAt,
    };
  },

  async updateRule(id, data) {
    const updated = await QualificationRuleModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) return null;
    return {
      _id: updated._id,
      id: updated._id.toString(),
      ruleCode: updated.ruleCode,
      name: updated.name,
      fromStage: updated.fromStage,
      toStage: updated.toStage,
      conditionField: updated.conditionField,
      operator: updated.operator,
      value: updated.value,
      autoAction: updated.autoAction,
      isActive: updated.isActive,
      priority: updated.priority,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  },

  async deleteRule(id) {
    await QualificationRuleModel.findByIdAndDelete(id).exec();
    return { success: true };
  },

  async deleteRulesMany(ids = []) {
    await QualificationRuleModel.deleteMany({ _id: { $in: ids } }).exec();
    return { success: true, count: ids.length };
  },

  // Telemetry Methods
  async getTelemetry() {
    const telemetry = await TelemetryEventModel.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .exec();
    
    return {
      data: telemetry.map(t => ({
        _id: t._id,
        id: t._id.toString(),
        timestamp: t.timestamp ? new Date(t.timestamp).toLocaleString() : 'Just now',
        leadName: t.leadName,
        leadCompany: t.leadCompany,
        eventType: t.eventType,
        scoreDelta: t.scoreDelta,
        resultingScore: t.resultingScore,
        appliedModel: t.appliedModel,
        status: t.status,
        latencyMs: t.latencyMs,
        leadId: t.leadId,
        modelId: t.modelId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      }))
    };
  },

  async getRulesCount() {
    const count = await QualificationRuleModel.countDocuments().exec();
    return count;
  },

  async deleteTelemetry(id) {
    await TelemetryEventModel.findByIdAndDelete(id).exec();
    return { success: true };
  },

  async deleteTelemetryMany(ids = []) {
    await TelemetryEventModel.deleteMany({ _id: { $in: ids } }).exec();
    return { success: true, count: ids.length };
  },

  // Bulk Seed dynamic data generator (creates ~10 rich realistic dynamic LeadIntel records)
  async seedDynamicData() {
    const tiers = ['Enterprise', 'Mid-Market', 'SMB', 'Strategic'];
    const sampleModels = [
      { name: 'Oncology Specialist Pipeline Scoring', tier: 'Enterprise', mql: 70, sql: 88, conv: 42.5 },
      { name: 'Cardiology Clinic Direct Inbound Matrix', tier: 'Strategic', mql: 75, sql: 90, conv: 49.1 },
      { name: 'Regional Radiology Center Funnel', tier: 'Mid-Market', mql: 60, sql: 80, conv: 33.7 },
      { name: 'Pediatric Care High-Velocity Model', tier: 'SMB', mql: 50, sql: 72, conv: 25.4 },
      { name: 'Telehealth Urgent Care Fast-Track', tier: 'SMB', mql: 55, sql: 75, conv: 28.0 },
      { name: 'Hospital Network ABM Cluster Matrix', tier: 'Enterprise', mql: 68, sql: 86, conv: 39.8 },
      { name: 'Orthopedic Multi-Location Scoring', tier: 'Mid-Market', mql: 62, sql: 82, conv: 31.2 },
      { name: 'MedTech Diagnostic Devices Accelerator', tier: 'Strategic', mql: 78, sql: 92, conv: 54.0 },
      { name: 'Outpatient Surgical Suite Model', tier: 'Enterprise', mql: 72, sql: 87, conv: 44.3 },
      { name: 'Integrated Pharma Trials Partner Scorer', tier: 'Strategic', mql: 80, sql: 94, conv: 58.6 },
    ];

    const createdModels = [];
    for (const m of sampleModels) {
      const uniqueSuffix = Math.floor(100 + Math.random() * 900);
      const uniqueCode = `MODEL-${m.tier.slice(0, 3).toUpperCase()}-${uniqueSuffix}`;
      
      const weights = {
        fb: Math.floor(5 + Math.random() * 15),
        linkedin: Math.floor(15 + Math.random() * 20),
        demo: Math.floor(25 + Math.random() * 20),
        email: Math.floor(10 + Math.random() * 15),
        webinar: Math.floor(10 + Math.random() * 15),
        websiteVisits: Math.floor(10 + Math.random() * 20),
      };

      const doc = await LeadIntelModel.findOneAndUpdate(
        { modelId: uniqueCode },
        {
          modelId: uniqueCode,
          profileName: m.name,
          targetTier: m.tier,
          weights,
          mqlThreshold: m.mql,
          sqlThreshold: m.sql,
          maxScore: 100,
          status: 'Active',
          evaluationCount: Math.floor(100 + Math.random() * 2500),
          conversionRate: m.conv,
          lastUpdated: 'Just now'
        },
        { upsert: true, new: true }
      );
      createdModels.push(doc);
    }

    // Seed 10 Dynamic Telemetry Events linked to these models
    const eventTypes = ['Form Submit', 'Demo Booked', 'LinkedIn Click', 'Page Visit', 'Whitepaper Download'];
    const statuses = ['Qualified', 'Evaluating', 'Nurturing', 'Auto-Promoted'];
    const sampleLeads = [
      { name: 'Dr. Jennifer Thorne', company: 'Mayo Integrated Health' },
      { name: 'Marcus Sterling', company: 'BioVanguard Labs' },
      { name: 'Dr. Tariq Al-Mansoor', company: 'Gulf Medical Systems' },
      { name: 'Emily Rosenthal', company: 'NovaCare Surgical' },
      { name: 'James Henderson', company: 'Apex Genomics Group' },
      { name: 'Dr. Chloe Bennett', company: 'Sutter Health Innovations' },
      { name: 'Vikram Mehta', company: 'Apollo Diagnostic Network' },
      { name: 'Rachel Zimmerman', company: 'Horizon Clinical Systems' },
      { name: 'Carlos Mendez', company: 'Sanitas Global Medical' },
      { name: 'Dr. Fiona Campbell', company: 'St. Jude Clinical Research' }
    ];

    for (let i = 0; i < sampleLeads.length; i++) {
      const lead = sampleLeads[i];
      const model = createdModels[i % createdModels.length];
      const scoreDelta = Math.floor(10 + Math.random() * 30);
      const resultingScore = Math.min(100, Math.floor(40 + Math.random() * 55));
      
      await TelemetryEventModel.create({
        timestamp: new Date(Date.now() - i * 15 * 60 * 1000),
        leadName: lead.name,
        leadCompany: lead.company,
        eventType: eventTypes[i % eventTypes.length],
        scoreDelta,
        resultingScore,
        appliedModel: model ? model.profileName : 'Enterprise SaaS Matrix',
        status: statuses[i % statuses.length],
        latencyMs: Math.floor(8 + Math.random() * 18),
      });
    }

    return {
      message: '10 Dynamic LeadIntel models and 10 dynamic telemetry records successfully created!',
      modelsCount: createdModels.length
    };
  }
};
