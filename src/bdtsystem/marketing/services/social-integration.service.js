import { SocialIntegrationModel } from '../models/social-integration.model.js';

export const SocialIntegrationService = {
    async getAll(filters = {}) {
        const query = {};
        if (filters.platform) query.platform = filters.platform;
        if (filters.status) query.status = filters.status;
        return await SocialIntegrationModel.find(query).sort({ createdAt: -1 }).exec();
    },

    async getById(id) {
        return await SocialIntegrationModel.findById(id).exec();
    },

    async getByUser(userId) {
        return await SocialIntegrationModel.find({ userId }).sort({ createdAt: -1 }).exec();
    },

    async connect(data) {
        const normalized = {
            userId: data.userId,
            platform: data.platform,
            provider_config_key: data.providerConfigKey || data.provider_config_key,
            connection_id: data.connectionId || data.connection_id,
            account_name: data.accountName || data.account_name || `${data.platform} Account`,
            connected_date: data.connected_date || Date.now(),
            status: 'Connected',
            auto_posting_enabled: data.auto_posting_enabled ?? true,
            notes: data.notes || 'Connected through Nango',
            connected_by: data.connected_by || 'Current User',
        };

        if (!normalized.userId || !normalized.platform || !normalized.provider_config_key || !normalized.connection_id) {
            throw new Error('userId, platform, providerConfigKey and connectionId are required.');
        }

        return await SocialIntegrationModel.findOneAndUpdate(
            { userId: normalized.userId, platform: normalized.platform },
            {
                ...normalized,
                followers_count: data.followers_count ?? 0,
                engagement_rate: data.engagement_rate ?? 0,
                posts_count: data.posts_count ?? 0,
                avg_likes_per_post: data.avg_likes_per_post ?? 0,
                avg_comments_per_post: data.avg_comments_per_post ?? 0,
                avg_shares_per_post: data.avg_shares_per_post ?? 0,
                last_post_date: data.last_post_date,
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).exec();
    },

    async create(data) {
        return await SocialIntegrationService.connect(data);
    },

    async update(id, data) {
        return await SocialIntegrationModel.findByIdAndUpdate(id, data, { new: true }).exec();
    },

    async delete(id) {
        await SocialIntegrationModel.findByIdAndDelete(id).exec();
        return { success: true };
    },
}