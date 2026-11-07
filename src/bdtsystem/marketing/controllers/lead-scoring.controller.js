import { LeadScoringService } from '../services/lead-scoring.service.js';

export const LeadScoringController = {
    async getAll(req,res) {
        try {
            const data = await LeadScoringService.getAll();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async getById(req,res) {
        try {
            const data = await LeadScoringService.getById(req.params.id);
            if (!data) return res.status(404).json({ message: 'Lead Score record not found' });
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async create(req,res) {
        try {
            const data = await LeadScoringService.create(req.body);
            return res.status(201).json(data);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req,res) {
        try {
            const data = await LeadScoringService.update(req.params.id, req.body);
            if (!data) return res.status(404).json({ message: 'Lead score record not found' });
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async delete(req,res) {
        try {
            const result = await LeadScoringService.delete(req.params.id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};