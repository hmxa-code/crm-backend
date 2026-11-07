import { VentureMatrixDealModel } from '../models/venture-matrix.model.js';

export const VentureMatrixService = {
  async getAll(query = {}) {
    return await VentureMatrixDealModel.find(query).sort({ createdAt: -1 }).exec();
  },

  async getById(id) {
    return await VentureMatrixDealModel.findById(id).exec();
  },

  async create(data) {
    const newDeal = new VentureMatrixDealModel(data);
    return await newDeal.save();
  },

  async update(id, data) {
    return await VentureMatrixDealModel.findByIdAndUpdate(id, data, { new: true }).exec();
  },

  async updateStage(id, stage) {
    return await VentureMatrixDealModel.findByIdAndUpdate(
      id, 
      { stage, stagnationDays: 0 }, 
      { new: true }
    ).exec();
  },

  async delete(id) {
    await VentureMatrixDealModel.findByIdAndDelete(id).exec();
    return { success: true };
  },

  async getPipelineAnalytics() {
    const deals = await VentureMatrixDealModel.find().exec();
    const totalPipelineValue = deals
      .filter(d => d.stage !== 'Closed Lost')
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    const weightedForecast = deals
      .filter(d => d.stage !== 'Closed Lost')
      .reduce((sum, d) => sum + ((d.amount || 0) * ((d.closeProbability || 0) / 100)), 0);

    const stagesBreakdown = deals.reduce((acc, d) => {
      acc[d.stage] = (acc[d.stage] || 0) + 1;
      return acc;
    }, {});

    const atRiskCount = deals.filter(d => d.slaBreachRisk === 'High' || d.slaBreachRisk === 'Critical').length;

    return {
      totalDeals: deals.length,
      totalPipelineValue,
      weightedForecast: Math.round(weightedForecast),
      averageMrr: deals.length > 0 ? Math.round(totalPipelineValue / deals.length / 12) : 0,
      atRiskCount,
      stagesBreakdown
    };
  }
};
