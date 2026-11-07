import { EventEmitter } from 'events';
import { DripCampaignModel } from '../models/drip-campaign.model.js';

// Central Event Bus for Decoupled Drip Journeys
export const dripEventBus = new EventEmitter();

export const DripCampaignsService = {
  async getAll() {
    return await DripCampaignModel.find()
      .populate('workflow_id', 'workflow_name status')
      .sort({ createdAt: -1 })
      .exec();
  },

  async getById(id) {
    return await DripCampaignModel.findById(id)
      .populate('workflow_id', 'workflow_name status')
      .exec();
  },

  async create(data) {
    if (!data.title && data.campaign_name) {
      data.title = data.campaign_name;
    }
    const newDrip = new DripCampaignModel(data);
    const saved = await newDrip.save();
    dripEventBus.emit('DRIP_CREATED', saved);
    return saved;
  },

  async update(id, data) {
    const updated = await DripCampaignModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (updated) {
      dripEventBus.emit('DRIP_UPDATED', updated);
    }
    return updated;
  },

  async updateStatus(id, status) {
    const updated = await DripCampaignModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (updated) {
      if (status === 'Active') {
        dripEventBus.emit('DRIP_ACTIVATED', updated);
      } else if (status === 'Paused') {
        dripEventBus.emit('DRIP_PAUSED', updated);
      } else if (status === 'Completed') {
        dripEventBus.emit('DRIP_COMPLETED', updated);
      }
    }
    return updated;
  },

  async delete(id) {
    await DripCampaignModel.findByIdAndDelete(id).exec();
    dripEventBus.emit('DRIP_DELETED', { id });
    return { success: true };
  },

  async deleteMany(ids = []) {
    await DripCampaignModel.deleteMany({ _id: { $in: ids } }).exec();
    dripEventBus.emit('DRIPS_BULK_DELETED', { ids });
    return { success: true, count: ids.length };
  },

  /**
   * Bulk Seed dynamic testing drip campaigns
   */
  async seedDynamicDrips() {
    const sampleDrips = [
      {
        title: 'High-Intent Enterprise Clinical Drip',
        desc: '6-step accelerated cadence for leads with LeadIntel score > 80.',
        triggerType: 'Behavior-Based',
        triggerDetail: 'Lead reaches MQL/SQL status via RenGrowCure LeadIntel',
        targetPersona: 'Chief Medical Officers & Enterprise Buyers',
        status: 'Active',
        stepsCount: 6,
        enrolled: 1840,
        active: 920,
        completed: 820
      },
      {
        title: 'Diagnostic Device Product Evaluation Nurture',
        desc: 'Product tour and safety validation documents for procurement teams.',
        triggerType: 'Event-Based',
        triggerDetail: 'Whitepaper or Tech Specs downloaded from Portal',
        targetPersona: 'Clinical Procurement Specialists',
        status: 'Active',
        stepsCount: 5,
        enrolled: 2450,
        active: 1320,
        completed: 1040
      },
      {
        title: 'Clinic Nutrition Wholesale Onboarding Flow',
        desc: 'Automated tasting sample shipment tracking & dietetic support.',
        triggerType: 'Event-Based',
        triggerDetail: 'Sample Tasting Box requested on web landing page',
        targetPersona: 'Clinical Nutritionists & Dietitians',
        status: 'Active',
        stepsCount: 7,
        enrolled: 1980,
        active: 1100,
        completed: 820
      },
      {
        title: 'Post-Webinar Re-Engagement & Meeting Booking',
        desc: 'Follow-up sequence sharing live Q&A deck and calendar scheduling links.',
        triggerType: 'Event-Based',
        triggerDetail: 'Attended live healthcare technology webinar',
        targetPersona: 'Hospital Practice Managers',
        status: 'Active',
        stepsCount: 4,
        enrolled: 3100,
        active: 840,
        completed: 2150
      },
      {
        title: 'Cold Lead Warming & Clinical Case Study Blast',
        desc: 'Gradual low-touch value education for stagnant contacts.',
        triggerType: 'Time-Based',
        triggerDetail: 'No interaction recorded for 21 consecutive days',
        targetPersona: 'Dormant Inbound Contacts',
        status: 'Active',
        stepsCount: 4,
        enrolled: 5400,
        active: 3200,
        completed: 1900
      },
      {
        title: 'Urgent Care Inventory Restock Automation',
        desc: 'Periodic supply checklist and one-click wholesale replenishment.',
        triggerType: 'Time-Based',
        triggerDetail: 'Every 30 days after initial shipment',
        targetPersona: 'Urgent Care Branch Administrators',
        status: 'Active',
        stepsCount: 3,
        enrolled: 1420,
        active: 950,
        completed: 440
      },
      {
        title: 'Telemedicine Regulatory Compliance Guide',
        desc: 'State-by-state compliance updates for multi-state practitioners.',
        triggerType: 'Behavior-Based',
        triggerDetail: 'Visited State Licensing or Compliance resource pages 3+ times',
        targetPersona: 'Virtual Care Founders',
        status: 'Paused',
        stepsCount: 5,
        enrolled: 860,
        active: 410,
        completed: 390
      },
      {
        title: 'Annual Contract Renewal & VIP Upsell Journey',
        desc: '90-day renewal warning, executive ROI summary, and enterprise perks.',
        triggerType: 'Time-Based',
        triggerDetail: '60 days prior to contract expiration date',
        targetPersona: 'Enterprise Account Owners',
        status: 'Active',
        stepsCount: 6,
        enrolled: 620,
        active: 480,
        completed: 120
      },
      {
        title: 'Unbooked Trial Fast-Response Intervention',
        desc: 'Direct outreach from Clinical Product Specialist to resolve friction.',
        triggerType: 'Behavior-Based',
        triggerDetail: 'Signed up for trial but didn’t book live demo within 48h',
        targetPersona: 'Inbound Trial Users',
        status: 'Active',
        stepsCount: 4,
        enrolled: 2200,
        active: 1150,
        completed: 980
      },
      {
        title: 'Pharma Research Partnership Discovery Drip',
        desc: 'Scientific brief and grant co-application invitation for labs.',
        triggerType: 'Behavior-Based',
        triggerDetail: 'Qualified as Strategic Account by RenGrowCure LeadIntel',
        targetPersona: 'Clinical Research Directors',
        status: 'Draft',
        stepsCount: 5,
        enrolled: 0,
        active: 0,
        completed: 0
      }
    ];

    const results = [];
    for (const d of sampleDrips) {
      const steps = [];
      for (let i = 1; i <= d.stepsCount; i++) {
        steps.push({
          id: `step_${i}_${Math.random().toString(36).substr(2, 5)}`,
          order: i,
          delayLabel: i === 1 ? 'Immediately' : `Wait ${i * 2} Days`,
          delayHours: (i - 1) * 48,
          actionType: i % 3 === 0 ? 'Send SMS' : i % 2 === 0 ? 'Add Tag' : 'Send Email',
          title: `Step ${i}: Touchpoint Engagement #${i}`,
          description: `Outreach dispatched according to clinical sequence parameters.`,
          subject: `Clinical sequence communication (Phase ${i})`,
          tagName: i % 2 === 0 ? 'Clinical-Engaged' : undefined,
          telemetry: {
            delivered: Math.floor(d.enrolled * (1 - (i * 0.1))),
            opened: Math.floor(d.enrolled * 0.55 * (1 - (i * 0.08))),
            clicked: Math.floor(d.enrolled * 0.22 * (1 - (i * 0.08))),
            converted: Math.floor(d.enrolled * 0.08 * (1 - (i * 0.08))),
            skipped: 10,
            failed: 2
          }
        });
      }

      const doc = await DripCampaignModel.findOneAndUpdate(
        { title: d.title },
        {
          title: d.title,
          campaign_name: d.title,
          description: d.desc,
          triggerType: d.triggerType,
          triggerDetail: d.triggerDetail,
          targetPersona: d.targetPersona,
          status: d.status,
          owner: 'Maya Patel (Demand Gen)',
          created_by: 'Growth Team',
          steps,
          telemetry: {
            totalEnrolled: d.enrolled,
            activeLeads: d.active,
            completedLeads: d.completed,
            unsubscribedLeads: Math.floor(d.enrolled * 0.02),
            bounced: Math.floor(d.enrolled * 0.01),
            overallConversionRate: d.enrolled > 0 ? Number(((d.completed * 0.25) / d.enrolled * 100).toFixed(1)) : 0
          }
        },
        { upsert: true, new: true }
      );
      results.push(doc);
    }

    return {
      message: '10 Enterprise Drip Campaigns synchronized successfully!',
      count: results.length
    };
  }
};
