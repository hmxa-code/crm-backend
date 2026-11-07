import leadsService from '../services/leads.service.js';

class LeadsController {
  async getLeads(req, res, next) {
    try {
      const result = await leadsService.getLeads(req.query);
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Leads retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getLeadById(req, res, next) {
    try {
      const lead = await leadsService.getLeadById(req.params.id);
      if (!lead) {
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }
      return res.status(200).json({
        success: true,
        data: lead,
        message: 'Lead fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async createLead(req, res, next) {
    try {
      const lead = await leadsService.createLead(req.body);
      return res.status(201).json({
        success: true,
        data: lead,
        message: 'Lead created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLead(req, res, next) {
    try {
      const lead = await leadsService.updateLead(req.params.id, req.body);
      if (!lead) {
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }
      return res.status(200).json({
        success: true,
        data: lead,
        message: 'Lead updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLead(req, res, next) {
    try {
      await leadsService.deleteLead(req.params.id);
      return res.status(200).json({
        success: true,
        data: null,
        message: 'Lead deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateStatus(req, res, next) {
    try {
      const { ids, status } = req.body;
      await leadsService.bulkUpdateStatus(ids, status);
      return res.status(200).json({
        success: true,
        message: 'Leads status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkDelete(req, res, next) {
    try {
      const { ids } = req.body;
      await leadsService.bulkDelete(ids);
      return res.status(200).json({
        success: true,
        message: 'Leads deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LeadsController();