import { LeadIntelService } from '../../services/LeadIntel/lead-intel.service.js';

export const LeadIntelController = {
  async getAll(req, res) {
    try {
      const data = await LeadIntelService.getAll(req.query);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await LeadIntelService.getById(req.params.id);
      if (!data) return res.status(404).json({ message: 'Lead not found' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const data = await LeadIntelService.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await LeadIntelService.update(req.params.id, req.body);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await LeadIntelService.delete(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async bulkDelete(req, res) {
    try {
      const { ids } = req.body;
      const result = await LeadIntelService.deleteMany(ids || []);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getRules(req, res) {
    try {
      const data = await LeadIntelService.getRules();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async createRule(req, res) {
    try {
      const data = await LeadIntelService.createRule(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateRule(req, res) {
    try {
      const data = await LeadIntelService.updateRule(req.params.id, req.body);
      if (!data) return res.status(404).json({ message: 'Rule not found' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteRule(req, res) {
    try {
      const result = await LeadIntelService.deleteRule(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async bulkDeleteRules(req, res) {
    try {
      const { ids } = req.body;
      const result = await LeadIntelService.deleteRulesMany(ids || []);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getTelemetry(req, res) {
    try {
      const data = await LeadIntelService.getTelemetry();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteTelemetry(req, res) {
    try {
      const result = await LeadIntelService.deleteTelemetry(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async bulkDeleteTelemetry(req, res) {
    try {
      const { ids } = req.body;
      const result = await LeadIntelService.deleteTelemetryMany(ids || []);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getRulesCount(req, res) {
    try {
      const count = await LeadIntelService.getRulesCount();
      return res.status(200).json(count);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async seedData(req, res) {
    try {
      const result = await LeadIntelService.seedDynamicData();
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
