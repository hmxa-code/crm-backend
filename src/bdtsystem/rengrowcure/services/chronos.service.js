import { ChronosLogModel } from '../models/chronos.model.js';

export const ChronosService = {
  async getAll(query = {}) {
    return await ChronosLogModel.find(query).sort({ timestamp: -1 }).limit(100).exec();
  },

  async create(data) {
    const log = new ChronosLogModel(data);
    return await log.save();
  }
};
