import { hasFullCrmAccess } from '../constants/roles.constants.js';
import { FEATURE_KEYS } from '../constants/permissions.constants.js';
import CustomRole from '../../../main-modules/users/role.model.js';

async function resolveCustomRolePermissions(customRoleId) {
  if (!customRoleId) return [];
  const role = await CustomRole.findById(customRoleId);
  return role?.permissions || [];
}

async function resolveEffectivePermissions(user) {
  if (hasFullCrmAccess(user.accountType)) {
    return [...FEATURE_KEYS];
  }

  const rolePermissions = await resolveCustomRolePermissions(user.customRole);
  const userPermissions = user.metadata?.permissions || [];
  return [...new Set([...rolePermissions, ...userPermissions])];
}

function canAccessFeature(user, featureKey) {
  if (hasFullCrmAccess(user.accountType)) return true;
  const permissions = user.effectivePermissions || user.metadata?.permissions || [];
  return permissions.includes(featureKey);
}

export { resolveCustomRolePermissions, resolveEffectivePermissions, canAccessFeature };
