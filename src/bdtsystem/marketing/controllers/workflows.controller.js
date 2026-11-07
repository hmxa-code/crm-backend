import { WorkflowsService } from '../services/workflows.service.js';

export const WorkflowsController = {
    async getAll(req,res) {
        try {
            const data = await WorkflowsService.getAll();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async getById(req,res) {
        try {
            const data = await WorkflowsService.getById(req.params.id);
            if (!data) return res.status(404).json({ message: 'Workflow flowchart not found' });
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async create(req,res) {
        try {
            const data = await WorkflowsService.create(req.body);
            return res.status(201).json(data);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async update(req,res) {
        try {
            const data = await WorkflowsService.update(req.params.id, req.body);
            if (!data) return res.status(404).json({ message: 'Workflow not found' });
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async delete(req,res) {
        try {
            const result = await WorkflowsService.delete(req.params.id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};