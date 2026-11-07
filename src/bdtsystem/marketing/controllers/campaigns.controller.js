import { CampaignsService } from '../services/campaigns.service.js';

/**
 * Enterprise Campaigns Controller
 * Strictly decoupled CRUD handler: delegating all automation to central workflow services.
 */
export const CampaignsController = {
  async getAll(req, res) {
    try {
      const data = await CampaignsService.getAll();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await CampaignsService.getById(req.params.id);
      if (!data) return res.status(404).json({ message: 'Campaign not found' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const data = await CampaignsService.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await CampaignsService.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ message: 'Campaign not found' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const data = await CampaignsService.updateStatus(req.params.id, req.body.status);
      if (!data) return res.status(404).json({ message: 'Campaign not found' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await CampaignsService.delete(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async bulkDelete(req, res) {
    try {
      const { ids } = req.body;
      const result = await CampaignsService.deleteMany(ids || []);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async seedData(req, res) {
    try {
      const result = await CampaignsService.seedDynamicCampaigns();
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
