export const AccountTypes = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SUB_ACCOUNT: 'sub_account',
};

// Legacy alias for middleware imports
export const UserRoles = AccountTypes;

export const isAccountOwner = (accountType) =>
  accountType === AccountTypes.SUPER_ADMIN || accountType === AccountTypes.ADMIN;

export const hasFullCrmAccess = (accountType) => isAccountOwner(accountType);
