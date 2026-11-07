import CustomRole from './role.model.js';

class RoleController {
  /**
   * Get all custom roles only
   * GET /api/roles
   */
  static async getAllRoles(req, res) {
    try {
      const { page = 1, limit = 50 } = req.query;
      const skip = (page - 1) * limit;

      const customRoles = await CustomRole.find()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await CustomRole.countDocuments();

      res.json({
        success: true,
        data: {
          roles: customRoles,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error('[Get All Roles Error]:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch roles',
      });
    }
  }

  static async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await CustomRole.findById(id);

      if (!role) {
        return res.status(404).json({
          success: false,
          message: 'Role not found',
        });
      }

      res.json({
        success: true,
        data: { role },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch role',
      });
    }
  }

  static async createRole(req, res) {
    try {
      const { role_name, description, permissions, status } = req.body;

      if (!role_name) {
        return res.status(400).json({
          success: false,
          message: 'Role name is required',
        });
      }

      const existingRole = await CustomRole.findOne({ role_name: new RegExp(`^${role_name}$`, 'i') });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Role name already exists',
        });
      }

      const newRole = new CustomRole({
        role_name,
        description: description || '',
        permissions: permissions || [],
        status: status ?? 1,
      });

      await newRole.save();

      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: { role: newRole },
      });
    } catch (error) {
      console.error('[Create Role Error]:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create role',
      });
    }
  }

  static async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { role_name, description, permissions, status } = req.body;

      const updateData = {};
      if (role_name) updateData.role_name = role_name;
      if (description !== undefined) updateData.description = description;
      if (permissions) updateData.permissions = permissions;
      if (status !== undefined) updateData.status = status;

      const updatedRole = await CustomRole.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedRole) {
        return res.status(404).json({
          success: false,
          message: 'Role not found',
        });
      }

      res.json({
        success: true,
        message: 'Role updated successfully',
        data: { role: updatedRole },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update role',
      });
    }
  }

  static async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const deletedRole = await CustomRole.findByIdAndDelete(id);

      if (!deletedRole) {
        return res.status(404).json({
          success: false,
          message: 'Role not found',
        });
      }

      res.json({
        success: true,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete role',
      });
    }
  }
}

export default RoleController;
