import { WorkflowModel } from '../models/workflow.model.js';

export const WorkflowsService = {
    async getAll() {
        return await WorkflowModel.find().sort({ createdAt: -1 }).exec();
    },

    async getById(id){
        return await WorkflowModel.findById(id).exec();
    },

    async getActiveByTrigger(triggerType) {
        return await WorkflowModel.findOne({ status: 'Active', trigger_type: triggerType }).exec();
    },

    async create(data) {
        const newWorkflow = new WorkflowModel(data);
        return await newWorkflow.save();
    },

    async update(id,data) {
        return await WorkflowModel.findByIdAndUpdate(id, data, { new: true }).exec();
    },

    async delete(id) {
        await WorkflowModel.findByIdAndDelete(id).exec();
        return { success: true };
    }
}