import { SocialPostModel } from '../models/social-post.model.js';

export const SocialPostsService = {
    async getAll(filters = {}) {
        const query = {};
        if (filters.platform) query.platform = filters.platform;
        if (filters.status) query.status = filters.status;
        if (filters.campaign_name) query.campaign_name = new RegExp(filters.campaign_name, 'i');
        return await SocialPostModel.find(query).sort({ scheduled_date: 1, createdAt: -1 }).exec();
    },

    async getById(id) {
        return await SocialPostModel.findById(id).exec();
    },

    async create(data) {
        const newPost = new SocialPostModel(data);
        return await newPost.save();
    },

    async update(id, data) {
        return await SocialPostModel.findByIdAndUpdate(id, data, { new: true }).exec();
    },

    async delete(id) {
        await SocialPostModel.findByIdAndDelete(id).exec();
        return { success: true };
    },
};
