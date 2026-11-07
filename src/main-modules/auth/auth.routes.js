import express from 'express';
const router = express.Router();

import { authenticate } from '../../core/rbac/middlewares/auth.middleware.js';
import { authorize } from '../../core/rbac/middlewares/roles.middleware.js';
import { AccountTypes } from '../../core/rbac/constants/roles.constants.js';
import AuthController from './auth.controller.js';

/**
 * Public Routes - No authentication required
 */
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

/**
 * Protected Routes - Authentication required
 */
router.post('/logout', authenticate, AuthController.logout);
router.get('/current-user', authenticate, AuthController.getCurrentUser);
router.post('/refresh-token', authenticate, AuthController.refreshToken);

/**
 * Protected Routes - Specific Role Required
 */
router.get('/all-users', authenticate, authorize(AccountTypes.SUPER_ADMIN, AccountTypes.ADMIN), AuthController.getAllUsers);
router.put('/update-profile', authenticate, AuthController.updateProfile);

export default router;
