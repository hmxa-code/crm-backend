import { ChronosService } from '../services/chronos.service.js';

export const ChronosController = {
  async getAll(req, res) {
    try {
      const data = await ChronosService.getAll(req.query);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const data = await ChronosService.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
