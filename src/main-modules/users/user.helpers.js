import mongoose from 'mongoose';
import CustomRole from './role.model.js';
import { AccountTypes } from '../../core/rbac/constants/roles.constants.js';
import { resolveEffectivePermissions } from '../../core/rbac/helpers/access.helpers.js';

async function isValidCustomRole(roleId) {
  if (!roleId || !mongoose.Types.ObjectId.isValid(roleId)) return false;
  const customRole = await CustomRole.findById(roleId);
  return !!customRole;
}

async function enrichUserWithRole(user) {
  const userObj = user.toObject ? user.toObject() : { ...user };

  if (userObj.customRole) {
    const customRole = await CustomRole.findById(userObj.customRole);
    userObj.roleDetails = customRole
      ? {
          _id: customRole._id,
          role_name: customRole.role_name,
          permissions: customRole.permissions || [],
        }
      : null;
  } else {
    userObj.roleDetails = null;
  }

  userObj.effectivePermissions = await resolveEffectivePermissions(userObj);
  return userObj;
}

async function enrichUsersWithRoles(users) {
  return Promise.all(users.map((user) => enrichUserWithRole(user)));
}

export {
  isValidCustomRole,
  enrichUserWithRole,
  enrichUsersWithRoles,
  AccountTypes,
};
