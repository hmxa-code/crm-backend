import { LeadScoreModel } from '../models/lead-scoring.model.js';

export const LeadScoringService = {
    async getAll() {
        return await LeadScoreModel.find().sort({ total_score: -1 }).exec();
    },

    async getById(id) {
        return await LeadScoreModel.findById(id).exec();
    },

    async create(data) {
        // Agar frontend se score calculation nahi ho rha to direct formula automatic apply kr skte hain:
        if(data.engagement_score || data.behavioral_score || data.demographic_score) {
            const eng = data.engagement_score || 0;
            const beh = data.behavioral_score || 0;
            const demo = data.demographic_score || 0;
            data.total_score = parseFloat(((eng + beh + demo) / 3).toFixed(1));
        }

        const newScore = new LeadScoreModel(data);
        return await newScore.save();
    },

    async update(id,data) {
        if(data.engagement_score || data.behavioral_score || data.demographic_score) {
            const eng = data.engagement_score || 0;
            const beh = data.behavioral_score || 0;
            const demo = data.demographic_score || 0;
            data.total_score = parseFloat(((eng + beh + demo) / 3).toFixed(1));
        }

        return await LeadScoreModel.findByIdAndUpdate(id,data, {new:true}).exec();
    },

    async delete(id) {
        await LeadScoreModel.findByIdAndDelete(id).exec();
        return { success: true };
    }

}