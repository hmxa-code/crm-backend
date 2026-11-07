import { SequenceModel } from '../models/outreach-sequence.model.js';

export const OutreachSequencesService = {
  async getAll(query = {}) {
    return await SequenceModel.find(query).sort({ createdAt: -1 }).exec();
  },

  async getById(id) {
    return await SequenceModel.findById(id).exec();
  },

  async create(data) {
    const seq = new SequenceModel(data);
    return await seq.save();
  },

  async update(id, data) {
    return await SequenceModel.findByIdAndUpdate(id, data, { new: true }).exec();
  },

  async delete(id) {
    await SequenceModel.findByIdAndDelete(id).exec();
    return { success: true };
  }
};
