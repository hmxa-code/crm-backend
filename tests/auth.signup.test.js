import test from 'node:test';
import assert from 'node:assert/strict';

import AuthController from '../src/modules/auth/auth.controller.js';
import { AccountTypes } from '../src/core/rbac/constants/roles.constants.js';

test('owner signup accepts admin and super_admin account types', () => {
  const adminResult = AuthController.validateSignupAccount({ accountType: AccountTypes.ADMIN });
  const superAdminResult = AuthController.validateSignupAccount({ accountType: AccountTypes.SUPER_ADMIN });

  assert.equal(adminResult.valid, true);
  assert.equal(adminResult.normalizedAccountType, AccountTypes.ADMIN);
  assert.equal(superAdminResult.valid, true);
  assert.equal(superAdminResult.normalizedAccountType, AccountTypes.SUPER_ADMIN);
});

test('public signup blocks sub-account creation', () => {
  const result = AuthController.validateSignupAccount({ accountType: AccountTypes.SUB_ACCOUNT });

  assert.equal(result.valid, false);
  assert.match(result.message, /Sub-accounts must be created/i);
});

test('public signup rejects unsupported roles', () => {
  const result = AuthController.validateSignupAccount({ accountType: 'manager' });

  assert.equal(result.valid, false);
  assert.match(result.message, /Allowed account types/i);
});
