import { VentureMatrixService } from '../services/venture-matrix.service.js';

export const VentureMatrixController = {
  async getAll(req, res) {
    try {
      const data = await VentureMatrixService.getAll(req.query);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await VentureMatrixService.getById(req.params.id);
      if (!data) return res.status(404).json({ message: 'Venture Deal not found' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const data = await VentureMatrixService.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await VentureMatrixService.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ message: 'Venture Deal not found' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateStage(req, res) {
    try {
      const { stage } = req.body;
      if (!stage) return res.status(400).json({ message: 'Stage is required' });
      const data = await VentureMatrixService.updateStage(req.params.id, stage);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await VentureMatrixService.delete(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getAnalytics(req, res) {
    try {
      const analytics = await VentureMatrixService.getPipelineAnalytics();
      return res.status(200).json(analytics);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
