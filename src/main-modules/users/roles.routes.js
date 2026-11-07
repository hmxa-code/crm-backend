import express from 'express';
import { authenticate } from '../../core/rbac/middlewares/auth.middleware.js';
import { authorize } from '../../core/rbac/middlewares/roles.middleware.js';
import { AccountTypes } from '../../core/rbac/constants/roles.constants.js';
import { CRM_FEATURES } from '../../core/rbac/constants/permissions.constants.js';
import RoleController from './role.controller.js';

const router = express.Router();

const accountOwners = [AccountTypes.SUPER_ADMIN, AccountTypes.ADMIN];

router.get('/features', authenticate, (req, res) => {
  res.json({
    success: true,
    data: { features: CRM_FEATURES },
  });
});

router.get('/', authenticate, authorize(...accountOwners), RoleController.getAllRoles);
router.get('/:id', authenticate, authorize(...accountOwners), RoleController.getRoleById);
router.post('/', authenticate, authorize(...accountOwners), RoleController.createRole);
router.put('/:id', authenticate, authorize(...accountOwners), RoleController.updateRole);
router.delete('/:id', authenticate, authorize(...accountOwners), RoleController.deleteRole);

export default router;
