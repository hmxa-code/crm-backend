import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './user.model.js';
import { AccountTypes } from '../../core/rbac/constants/roles.constants.js';
import { enrichUserWithRole } from '../users/user.helpers.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

class AuthController {
  static validateSignupAccount(accountType) {
    const allowedAccountTypes = [AccountTypes.SUPER_ADMIN, AccountTypes.ADMIN];
    const normalizedAccountType = typeof accountType === 'string' ? accountType.trim() : '';

    if (!normalizedAccountType) {
      return {
        valid: true,
        normalizedAccountType: AccountTypes.ADMIN,
        message: 'No account type provided. Defaulting to admin.',
      };
    }

    if (normalizedAccountType === AccountTypes.SUB_ACCOUNT) {
      return {
        valid: false,
        normalizedAccountType: AccountTypes.SUB_ACCOUNT,
        message: 'Sub-accounts must be created by an authenticated admin or super admin from the sub-account management flow.',
      };
    }

    if (!allowedAccountTypes.includes(normalizedAccountType)) {
      return {
        valid: false,
        normalizedAccountType: normalizedAccountType,
        message: `Allowed account types for signup are ${allowedAccountTypes.join(', ')}.`,
      };
    }

    return {
      valid: true,
      normalizedAccountType: normalizedAccountType,
      message: 'Account type is valid.',
    };
  }

  /**
   * User Signup
   * POST /api/auth/signup
   */
  static async signup(req, res) {
    try {
      const { name, email, password, phone, accountType } = req.body;

      // Basic Validation
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required',
        });
      }

      const signupValidation = AuthController.validateSignupAccount(accountType);
      if (!signupValidation.valid) {
        return res.status(400).json({
          success: false,
          message: signupValidation.message,
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const finalAccountType = signupValidation.normalizedAccountType;

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone: phone || '',
        accountType: finalAccountType,
        role: finalAccountType,
        status: 'ACTIVE',
      });

      await newUser.save();

      const token = jwt.sign(
        {
          userId: newUser._id,
          email: newUser.email,
          accountType: newUser.accountType,
          role: newUser.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      const formattedUser = await enrichUserWithRole(newUser);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user: AuthController._formatUserResponse(formattedUser),
          token,
        },
      });
    } catch (error) {
      console.error('[Auth Signup Error]:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Signup failed',
      });
    }
  }

  /**
   * User Login
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      // Find user and explicitly select password
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          message: 'Your account is inactive',
        });
      }

      // Generate JWT Token using DB's actual accountType & role
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          accountType: user.accountType,
          role: user.role || user.accountType,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      const formattedUser = await enrichUserWithRole(user);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: AuthController._formatUserResponse(formattedUser),
          token,
        },
      });
    } catch (error) {
      console.error('[Auth Login Error]:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  }

  /**
   * Get Current User
   * GET /api/auth/current-user
   */
  static async getCurrentUser(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const formattedUser = await enrichUserWithRole(user);

      res.json({
        success: true,
        data: {
          user: AuthController._formatUserResponse(formattedUser),
        },
      });
    } catch (error) {
      console.error('[Get Current User Error]:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch current user',
      });
    }
  }

  /**
   * Format user response (remove sensitive data)
   */
  static _formatUserResponse(user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      accountType: user.accountType,
      role: user.role || user.accountType,
      customRole: user.customRole,
      roleDetails: user.roleDetails || null,
      effectivePermissions: user.effectivePermissions || user.metadata?.permissions || [],
      parentAccount: user.parentAccount,
      avatar: user.avatar,
      status: user.status,
      metadata: user.metadata || { permissions: [] },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update User Profile
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { name, phone, avatar } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (avatar) updateData.avatar = avatar;

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: AuthController._formatUserResponse(updatedUser),
        },
      });
    } catch (error) {
      console.error('[Update Profile Error]:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update profile',
      });
    }
  }

  /**
   * Logout
   */
  static async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  }

  /**
   * Refresh Token
   */
  static async refreshToken(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          accountType: user.accountType,
          role: user.role || user.accountType,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      res.json({
        success: true,
        message: 'Token refreshed',
        data: {
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Token refresh failed',
      });
    }
  }

  /**
   * Get All Users (Admin only)
   */
  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select('-password')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments();

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error('[Get All Users Error]:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch users',
      });
    }
  }
}

export default AuthController;