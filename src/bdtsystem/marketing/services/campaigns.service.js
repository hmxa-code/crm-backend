import { EventEmitter } from 'events';
import { CampaignModel } from '../models/campaign.model.js';

// Central Event Bus for Decoupled CRM Architecture
export const campaignEventBus = new EventEmitter();

export const CampaignsService = {
  /**
   * Fetch all campaigns, populated with central workflow details if linked
   */
  async getAll() {
    return await CampaignModel.find()
      .populate('workflow_id', 'workflow_name status')
      .sort({ createdAt: -1 })
      .exec();
  },

  async getById(id) {
    return await CampaignModel.findById(id)
      .populate('workflow_id', 'workflow_name status')
      .exec();
  },

  async create(data) {
    const newCampaign = new CampaignModel(data);
    const saved = await newCampaign.save();
    
    // Emit domain event for Central Workflow Engine
    campaignEventBus.emit('CAMPAIGN_CREATED', saved);
    return saved;
  },

  async update(id, data) {
    const updated = await CampaignModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (updated) {
      campaignEventBus.emit('CAMPAIGN_UPDATED', updated);
    }
    return updated;
  },

  /**
   * Update Status with event notification to Central Workflow Engine
   */
  async updateStatus(id, status) {
    const updated = await CampaignModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (updated) {
      if (status === 'Active') {
        campaignEventBus.emit('CAMPAIGN_ACTIVATED', updated);
      } else if (status === 'Paused') {
        campaignEventBus.emit('CAMPAIGN_PAUSED', updated);
      } else if (status === 'Completed') {
        campaignEventBus.emit('CAMPAIGN_COMPLETED', updated);
      }
    }
    return updated;
  },

  async delete(id) {
    await CampaignModel.findByIdAndDelete(id).exec();
    campaignEventBus.emit('CAMPAIGN_DELETED', { id });
    return { success: true };
  },

  async deleteMany(ids = []) {
    await CampaignModel.deleteMany({ _id: { $in: ids } }).exec();
    campaignEventBus.emit('CAMPAIGNS_BULK_DELETED', { ids });
    return { success: true, count: ids.length };
  },

  /**
   * Bulk Seed dynamic testing campaigns
   */
  async seedDynamicCampaigns() {
    const sampleCampaigns = [
      {
        name: 'Enterprise Clinical Trial Expansion 2026',
        type: 'Email',
        status: 'Active',
        audience: 'Chief Medical Officers & Clinical Research Directors',
        budget: 8500,
        target_count: 14200,
        recipient_count: 11450,
        open_rate: 52.4,
        click_rate: 21.8,
        conversion_rate: 8.6,
        notes: 'Outreach focused on multi-center clinical diagnostics adoption. Automated cadences linked via Central Workflow Engine.'
      },
      {
        name: 'Diagnostic AI Hardware Showcase & In-Person Tasting Tour',
        type: 'Multi-Channel',
        status: 'Active',
        audience: 'Hospital Operations Directors & Diagnostic Labs',
        budget: 12400,
        target_count: 9800,
        recipient_count: 7340,
        open_rate: 61.2,
        click_rate: 28.5,
        conversion_rate: 11.4,
        notes: 'Synchronized field invitations with targeted LinkedIn InMail. Follow-up automated in Workflow Engine.'
      },
      {
        name: 'Urgent Care Seasonal Supplies Bulk Procurement Flash Blast',
        type: 'SMS',
        status: 'Active',
        audience: 'Urgent Care Center Branch Managers',
        budget: 3200,
        target_count: 16500,
        recipient_count: 15800,
        open_rate: 91.5,
        click_rate: 34.2,
        conversion_rate: 14.8,
        notes: 'Direct priority SMS alerts with one-click portal reorder links.'
      },
      {
        name: 'Telemedicine Regulatory & Compliance Whitepaper Push',
        type: 'Social',
        status: 'Scheduled',
        audience: 'Telehealth General Counsels & Compliance Officers',
        budget: 5400,
        target_count: 22000,
        recipient_count: 0,
        open_rate: 0,
        click_rate: 0,
        conversion_rate: 0,
        notes: 'Sponsored industry report addressing cross-state licensure and HIPAA compliance.'
      },
      {
        name: 'Post-Symposium Executive Q&A Re-Engagement',
        type: 'Email',
        status: 'Completed',
        audience: 'Registered Global Healthcare Symposium Attendees',
        budget: 6800,
        target_count: 18400,
        recipient_count: 18400,
        open_rate: 56.8,
        click_rate: 24.3,
        conversion_rate: 9.7,
        notes: 'High conversion follow-up delivering recorded sessions and custom proposal links.'
      },
      {
        name: 'Pediatric Care Clinical Inactive Re-Activation Push',
        type: 'Push',
        status: 'Paused',
        audience: 'Dormant Clinic Software Accounts (> 30 days inactive)',
        budget: 950,
        target_count: 4200,
        recipient_count: 2400,
        open_rate: 32.1,
        click_rate: 8.4,
        conversion_rate: 3.2,
        notes: 'In-app notification prompt offering annual re-enrollment discount.'
      },
      {
        name: 'Cardiology Equipment Q4 Fiscal Year-End Incentive Package',
        type: 'Multi-Channel',
        status: 'Active',
        audience: 'Cardiology Clinic Owners & Hospital Procurement Heads',
        budget: 9800,
        target_count: 7500,
        recipient_count: 5120,
        open_rate: 49.6,
        click_rate: 19.4,
        conversion_rate: 7.8,
        notes: 'Capital medical hardware leasing incentives combined with dedicated sales rep assignment.'
      },
      {
        name: 'Self-Serve Clinical Trial Onboarding Pathway',
        type: 'Email',
        status: 'Active',
        audience: 'Inbound Portal Registered Medical Practitioners',
        budget: 1800,
        target_count: 15200,
        recipient_count: 13900,
        open_rate: 68.4,
        click_rate: 31.2,
        conversion_rate: 15.6,
        notes: 'Core onboarding sequence guiding doctors from initial setup to first clinical batch run.'
      },
      {
        name: 'Pharmaceutical Co-Marketing & Research Grant Partner Search',
        type: 'Social',
        status: 'Draft',
        audience: 'Tier-1 Biotech & Research Institute Executives',
        budget: 4500,
        target_count: 6400,
        recipient_count: 0,
        open_rate: 0,
        click_rate: 0,
        conversion_rate: 0,
        notes: 'Co-grant application invitation for joint AI clinical methodology testing.'
      },
      {
        name: 'Regional Radiology Clinic Network Software Upgrade Briefing',
        type: 'Email',
        status: 'Active',
        audience: 'Independent Imaging & Radiology Practice Partners',
        budget: 2900,
        target_count: 8100,
        recipient_count: 6450,
        open_rate: 44.8,
        click_rate: 16.7,
        conversion_rate: 6.2,
        notes: 'Highlighting cloud DICOM viewer upgrades and automated appointment reminder features.'
      }
    ];

    const results = [];
    for (const c of sampleCampaigns) {
      const doc = await CampaignModel.findOneAndUpdate(
        { campaign_name: c.name },
        {
          campaign_name: c.name,
          campaign_type: c.type,
          status: c.status,
          start_date: Date.now() - Math.floor(Math.random() * 10 * 86400000),
          end_date: Date.now() + Math.floor(Math.random() * 20 * 86400000),
          target_audience: c.audience,
          target_count: c.target_count,
          recipient_count: c.recipient_count,
          open_rate: c.open_rate,
          click_rate: c.click_rate,
          conversion_rate: c.conversion_rate,
          budget: c.budget,
          notes: c.notes,
          utm_source: 'crm_marketing',
          utm_medium: c.type.toLowerCase(),
          utm_campaign: c.name.toLowerCase().replace(/\s+/g, '_'),
          created_by: 'Growth Team'
        },
        { upsert: true, new: true }
      );
      results.push(doc);
    }

    return {
      message: '10 Enterprise Campaigns synchronized successfully!',
      count: results.length
    };
  }
};
