import { DripCampaignsService } from '../services/drip-campaigns.service.js';

/**
 * Enterprise Drip Campaigns Controller
 * Clean CRUD controller decoupled from scheduling logic (handled by workflows).
 */
export const DripCampaignsController = {
  async getAll(req, res) {
    try {
      const data = await DripCampaignsService.getAll();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await DripCampaignsService.getById(req.params.id);
      if (!data) return res.status(404).json({ message: 'Drip campaign not found' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const data = await DripCampaignsService.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await DripCampaignsService.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ message: 'Drip campaign not found' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const data = await DripCampaignsService.updateStatus(req.params.id, req.body.status);
      if (!data) return res.status(404).json({ message: 'Drip campaign not found' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await DripCampaignsService.delete(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async bulkDelete(req, res) {
    try {
      const { ids } = req.body;
      const result = await DripCampaignsService.deleteMany(ids || []);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async seedData(req, res) {
    try {
      const result = await DripCampaignsService.seedDynamicDrips();
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
