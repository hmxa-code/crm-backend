import { SocialPostsService } from '../services/social-posts.service.js';

export const SocialPostsController = {
    async getAll(req, res) {
        try {
            const filters = {
                platform: req.query.platform,
                status: req.query.status,
                campaign_name: req.query.campaign_name,
            };
            const data = await SocialPostsService.getAll(filters);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async getById(req, res) {
        try {
            const data = await SocialPostsService.getById(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: 'Social post not found' });
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async create(req, res) {
        try {
            const data = await SocialPostsService.create(req.body);
            return res.status(201).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req, res) {
        try {
            const data = await SocialPostsService.update(req.params.id, req.body);
            if (!data) return res.status(404).json({ success: false, message: 'Social post not found' });
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async delete(req, res) {
        try {
            const result = await SocialPostsService.delete(req.params.id);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
};
