import { DistroRuleModel } from '../models/distro-engine.model.js';

export const DistroEngineService = {
  async getAll(query = {}) {
    return await DistroRuleModel.find(query).sort({ priorityLevel: 1 }).exec();
  },

  async getById(id) {
    return await DistroRuleModel.findById(id).exec();
  },

  async create(data) {
    const rule = new DistroRuleModel(data);
    return await rule.save();
  },

  async update(id, data) {
    return await DistroRuleModel.findByIdAndUpdate(id, data, { new: true }).exec();
  },

  async delete(id) {
    await DistroRuleModel.findByIdAndDelete(id).exec();
    return { success: true };
  }
};
