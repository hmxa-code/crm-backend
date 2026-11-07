import { KineticsActionModel } from '../models/kinetics.model.js';

export const KineticsService = {
  async getAll(query = {}) {
    return await KineticsActionModel.find(query).sort({ createdAt: -1 }).exec();
  },

  async getById(id) {
    return await KineticsActionModel.findById(id).exec();
  },

  async create(data) {
    const action = new KineticsActionModel(data);
    return await action.save();
  },

  async update(id, data) {
    return await KineticsActionModel.findByIdAndUpdate(id, data, { new: true }).exec();
  },

  async delete(id) {
    await KineticsActionModel.findByIdAndDelete(id).exec();
    return { success: true };
  }
};
