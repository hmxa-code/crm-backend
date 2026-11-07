const CRM_FEATURES = [
  { key: 'dashboard', label: 'Dashboard', module: 'Core' },
  { key: 'financial', label: 'Finance', module: 'Core' },
  { key: 'marketing', label: 'Marketing', module: 'Core' },
  { key: 'leads', label: 'Leads Management', module: 'Core' },
  { key: 'sales', label: 'Sales Management', module: 'Core' },
  { key: 'real-estate', label: 'Real Estate', module: 'Core' },
  { key: 'companies', label: 'Companies', module: 'Core' },
  { key: 'opportunities', label: 'Opportunities', module: 'Core' },
  { key: 'users', label: 'User Management', module: 'Admin' },
  { key: 'roles', label: 'Roles Management', module: 'Admin' },
];

const FEATURE_KEYS = CRM_FEATURES.map((f) => f.key);
const AVAILABLE_PERMISSIONS = CRM_FEATURES;

export { CRM_FEATURES, FEATURE_KEYS, AVAILABLE_PERMISSIONS };