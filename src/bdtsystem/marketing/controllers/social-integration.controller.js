import { SocialIntegrationService } from '../services/social-integration.service.js';

export const SocialIntegrationController = {
    async getAll(req,res) {
        try {
            const filters = {
                platform: req.query.platform,
                status: req.query.status,
            };
            const data = await SocialIntegrationService.getAll(filters);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async getByUser(req,res) {
        try {
            const data = await SocialIntegrationService.getByUser(req.params.userId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async getById(req,res) {
        try {
            const data = await SocialIntegrationService.getById(req.params.id);
            if(!data) return res.status(404).json({ success: false, message: 'Social integration platform not found' });
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async connect(req,res) {
        try {
            const data = await SocialIntegrationService.connect(req.body);
            return res.status(201).json({ success: true, data });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    },

    async create(req,res) {
        try {
            const data = await SocialIntegrationService.create(req.body);
            return res.status(201).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req,res) {
        try {
            const data = await SocialIntegrationService.update(req.params.id, req.body);
            if (!data) return res.status(404).json({ success: false, message: 'Integration not found' });
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async delete(req,res) {
        try {
            const result = await SocialIntegrationService.delete(req.params.id);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};