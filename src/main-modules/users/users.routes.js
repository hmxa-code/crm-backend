import express from 'express';
import bcrypt from 'bcryptjs';
import { authenticate } from '../../core/rbac/middlewares/auth.middleware.js';
import { authorize } from '../../core/rbac/middlewares/roles.middleware.js';
import { AccountTypes } from '../../core/rbac/constants/roles.constants.js';
import { CRM_FEATURES } from '../../core/rbac/constants/permissions.constants.js';
import User from '../auth/user.model.js';
import { isValidCustomRole, enrichUsersWithRoles, enrichUserWithRole } from './user.helpers.js';

const router = express.Router();

const accountOwners = [AccountTypes.SUPER_ADMIN, AccountTypes.ADMIN];

const isOwner = (req) =>
  accountOwners.includes(req.user.accountType) || accountOwners.includes(req.user.role);

router.get('/features', authenticate, authorize(...accountOwners), (req, res) => {
  res.json({
    success: true,
    data: { features: CRM_FEATURES },
  });
});

/**
 * Get sub-accounts created by current admin
 * GET /api/users
 */
router.get('/', authenticate, authorize(...accountOwners), async (req, res) => {
  try {
    const { page = 1, limit = 50, status, subAccountsOnly = 'true' } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;

    if (subAccountsOnly === 'true') {
      filter.accountType = AccountTypes.SUB_ACCOUNT;
      filter.parentAccount = req.user.userId;
    }

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const enrichedUsers = await enrichUsersWithRoles(users);
    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users: enrichedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('[Get Users Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users',
    });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (req.user.userId !== id && !isOwner(req)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this user',
      });
    }

    const enrichedUser = await enrichUserWithRole(user);

    res.json({
      success: true,
      data: { user: enrichedUser },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user',
    });
  }
});

/**
 * Create sub-account with custom role
 * POST /api/users
 */
router.post('/', authenticate, authorize(...accountOwners), async (req, res) => {
  try {
    const { name, email, password, phone, role, customRole, status, avatar, permissions } = req.body;
    const roleId = customRole || role;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const requestedAccountType = req.body.accountType || AccountTypes.SUB_ACCOUNT;
    if (requestedAccountType !== AccountTypes.SUB_ACCOUNT) {
      return res.status(400).json({
        success: false,
        message: 'Only sub-accounts can be created from this authenticated owner flow. Public signup is restricted to admin/super-admin.',
      });
    }

    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: 'Custom role is required for sub-accounts',
      });
    }

    if (!(await isValidCustomRole(roleId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid custom role selected',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      accountType: AccountTypes.SUB_ACCOUNT,
      customRole: roleId,
      parentAccount: req.user.userId,
      status: status || 'ACTIVE',
      avatar: avatar || null,
      metadata: {
        permissions: Array.isArray(permissions) ? permissions : [],
      },
    });

    await newUser.save();

    const userResponse = await enrichUserWithRole(newUser);
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Sub-account created successfully',
      data: { user: userResponse },
    });
  } catch (error) {
    console.error('[Create User Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create user',
    });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, role, customRole, status, avatar, password, permissions } = req.body;

    if (req.user.userId !== id && !isOwner(req)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this user',
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    if (isOwner(req)) {
      const roleId = customRole || role;
      if (roleId) {
        if (!(await isValidCustomRole(roleId))) {
          return res.status(400).json({
            success: false,
            message: 'Invalid custom role selected',
          });
        }
        updateData.customRole = roleId;
        updateData.accountType = AccountTypes.SUB_ACCOUNT;
      }
      if (status) updateData.status = status;
      if (Array.isArray(permissions)) {
        updateData['metadata.permissions'] = permissions;
      }
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const enrichedUser = await enrichUserWithRole(updatedUser);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: enrichedUser },
    });
  } catch (error) {
    console.error('[Update User Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user',
    });
  }
});

router.delete('/:id', authenticate, authorize(...accountOwners), async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user',
    });
  }
});

export default router;
