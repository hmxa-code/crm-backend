import { OutreachSequencesService } from '../services/outreach-sequences.service.js';

export const OutreachSequencesController = {
  async getAll(req, res) {
    try {
      const data = await OutreachSequencesService.getAll(req.query);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await OutreachSequencesService.getById(req.params.id);
      if (!data) return res.status(404).json({ message: 'Sequence not found' });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const data = await OutreachSequencesService.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await OutreachSequencesService.update(req.params.id, req.body);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await OutreachSequencesService.delete(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
