import Lead from '../models/leads.model.js';

class LeadsService {
  async getLeads(queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };

    if (queryParams.search) {
      const searchRegex = new RegExp(queryParams.search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
      ];
    }

    if (queryParams.status) {
      query.status = queryParams.status;
    }

    if (queryParams.ownerId) query.owner_id = queryParams.ownerId;
    if (queryParams.companyId) query.company_id = queryParams.companyId;

    const sortField = queryParams.sortBy || 'createdAt';
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(query),
    ]);

    return {
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getLeadById(id) {
    return await Lead.findOne({ _id: id, isDeleted: false });
  }

  async createLead(leadData) {
    const lead = new Lead(leadData);
    return await lead.save();
  }

  async updateLead(id, updateData) {
    return await Lead.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async deleteLead(id) {
    return await Lead.findOneAndUpdate(
      { _id: id },
      { $set: { isDeleted: true } },
      { new: true }
    );
  }

  async bulkUpdateStatus(ids, status) {
    return await Lead.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { $set: { status } }
    );
  }

  async bulkDelete(ids) {
    return await Lead.updateMany(
      { _id: { $in: ids } },
      { $set: { isDeleted: true } }
    );
  }
}

export default new LeadsService();