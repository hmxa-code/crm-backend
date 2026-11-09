import swaggerJsdoc from 'swagger-jsdoc';

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

const jsonBody = {
  required: true,
  content: {
    'application/json': {
      schema: { type: 'object', additionalProperties: true },
    },
  },
};

const bearer = [{ bearerAuth: [] }];

function crud(tag, extra = {}) {
  return {
    get: {
      tags: [tag],
      summary: extra.listSummary || 'List all',
      security: extra.security,
      parameters: extra.listParams,
      responses: { 200: { description: 'Success' } },
    },
    post: {
      tags: [tag],
      summary: extra.createSummary || 'Create',
      security: extra.security,
      requestBody: jsonBody,
      responses: { 201: { description: 'Created' }, 200: { description: 'Success' } },
    },
  };
}

function byId(tag, extra = {}) {
  return {
    get: {
      tags: [tag],
      summary: extra.getSummary || 'Get by id',
      security: extra.security,
      parameters: [idParam],
      responses: { 200: { description: 'Success' }, 404: { description: 'Not found' } },
    },
    put: {
      tags: [tag],
      summary: extra.updateSummary || 'Update by id',
      security: extra.security,
      parameters: [idParam],
      requestBody: jsonBody,
      responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
    },
    delete: {
      tags: [tag],
      summary: extra.deleteSummary || 'Delete by id',
      security: extra.security,
      parameters: [idParam],
      responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
    },
  };
}

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'CRM Backend API',
    version: '1.0.0',
    description:
      'Interactive docs for existing backend routes. Use Authorize after login and paste the JWT (Bearer). Auth-protected routes: /api/auth (except signup/login), /api/roles, /api/users.',
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Local' },
  ],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Roles' },
    { name: 'Users' },
    { name: 'Leads' },
    { name: 'Contacts' },
    { name: 'Campaigns' },
    { name: 'Drip Campaigns' },
    { name: 'Lead Scoring' },
    { name: 'Social Integration' },
    { name: 'Social Posts' },
    { name: 'Workflows' },
    { name: 'Venture Matrix' },
    { name: 'Lead Intel' },
    { name: 'Distro Engine' },
    { name: 'Outreach Sequences' },
    { name: 'Chronos' },
    { name: 'Kinetics' },
    { name: 'Tasks' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT from POST /api/auth/login → data.token',
      },
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-auth-token',
      },
    },
  },
  paths: {
    '/': {
      get: {
        tags: ['Health'],
        summary: 'API root status',
        responses: { 200: { description: 'API is running' } },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: { 200: { description: 'Healthy' } },
      },
    },

    '/api/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Sign up (admin / super-admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  phone: { type: 'string' },
                  accountType: { type: 'string', example: 'ADMIN' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' }, 400: { description: 'Validation error' } },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Success — copy data.token' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout',
        security: bearer,
        responses: { 200: { description: 'Logged out' }, 401: { description: 'Unauthorized' } },
      },
    },
    '/api/auth/current-user': {
      get: {
        tags: ['Auth'],
        summary: 'Current user',
        security: bearer,
        responses: { 200: { description: 'Success' }, 401: { description: 'Unauthorized' } },
      },
    },
    '/api/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh JWT',
        security: bearer,
        responses: { 200: { description: 'New token' }, 401: { description: 'Unauthorized' } },
      },
    },
    '/api/auth/all-users': {
      get: {
        tags: ['Auth'],
        summary: 'List all users (admin / super-admin)',
        security: bearer,
        responses: { 200: { description: 'Success' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' } },
      },
    },
    '/api/auth/update-profile': {
      put: {
        tags: ['Auth'],
        summary: 'Update profile',
        security: bearer,
        requestBody: jsonBody,
        responses: { 200: { description: 'Updated' }, 401: { description: 'Unauthorized' } },
      },
    },

    '/api/roles/features': {
      get: {
        tags: ['Roles'],
        summary: 'CRM features list',
        security: bearer,
        responses: { 200: { description: 'Success' } },
      },
    },
    '/api/roles': crud('Roles', { security: bearer, listSummary: 'List roles', createSummary: 'Create role' }),
    '/api/roles/{id}': byId('Roles', { security: bearer }),

    '/api/users/features': {
      get: {
        tags: ['Users'],
        summary: 'CRM features list (owners)',
        security: bearer,
        responses: { 200: { description: 'Success' } },
      },
    },
    '/api/users': {
      ...crud('Users', {
        security: bearer,
        listSummary: 'List users / sub-accounts',
        createSummary: 'Create sub-account',
        listParams: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'subAccountsOnly', in: 'query', schema: { type: 'string', default: 'true' } },
        ],
      }),
    },
    '/api/users/{id}': byId('Users', { security: bearer }),

    '/api/leads': {
      ...crud('Leads', { listSummary: 'List leads', createSummary: 'Create lead' }),
    },
    '/api/leads/{id}': byId('Leads'),
    '/api/leads/bulk/status': {
      post: {
        tags: ['Leads'],
        summary: 'Bulk update lead status',
        requestBody: jsonBody,
        responses: { 200: { description: 'Success' } },
      },
    },
    '/api/leads/bulk/delete': {
      post: {
        tags: ['Leads'],
        summary: 'Bulk delete leads',
        requestBody: jsonBody,
        responses: { 200: { description: 'Success' } },
      },
    },

    '/api/contacts': {
      ...crud('Contacts', { listSummary: 'List contacts (same handler as leads)', createSummary: 'Create contact' }),
    },
    '/api/contacts/{id}': byId('Contacts'),
    '/api/contacts/bulk/status': {
      post: {
        tags: ['Contacts'],
        summary: 'Bulk update contact status',
        requestBody: jsonBody,
        responses: { 200: { description: 'Success' } },
      },
    },
    '/api/contacts/bulk/delete': {
      post: {
        tags: ['Contacts'],
        summary: 'Bulk delete contacts',
        requestBody: jsonBody,
        responses: { 200: { description: 'Success' } },
      },
    },

    '/api/marketing/campaigns/seed-dynamic': {
      post: { tags: ['Campaigns'], summary: 'Seed dynamic campaign data', responses: { 200: { description: 'Success' } } },
    },
    '/api/marketing/campaigns/bulk-delete': {
      post: { tags: ['Campaigns'], summary: 'Bulk delete campaigns', requestBody: jsonBody, responses: { 200: { description: 'Success' } } },
    },
    '/api/marketing/campaigns': crud('Campaigns'),
    '/api/marketing/campaigns/{id}': byId('Campaigns'),
    '/api/marketing/campaigns/{id}/status': {
      patch: {
        tags: ['Campaigns'],
        summary: 'Update campaign status',
        parameters: [idParam],
        requestBody: jsonBody,
        responses: { 200: { description: 'Updated' } },
      },
    },

    '/api/marketing/drip-campaigns/seed-dynamic': {
      post: { tags: ['Drip Campaigns'], summary: 'Seed dynamic drip campaigns', responses: { 200: { description: 'Success' } } },
    },
    '/api/marketing/drip-campaigns/bulk-delete': {
      post: { tags: ['Drip Campaigns'], summary: 'Bulk delete drip campaigns', requestBody: jsonBody, responses: { 200: { description: 'Success' } } },
    },
    '/api/marketing/drip-campaigns': crud('Drip Campaigns'),
    '/api/marketing/drip-campaigns/{id}': byId('Drip Campaigns'),
    '/api/marketing/drip-campaigns/{id}/status': {
      patch: {
        tags: ['Drip Campaigns'],
        summary: 'Update drip campaign status',
        parameters: [idParam],
        requestBody: jsonBody,
        responses: { 200: { description: 'Updated' } },
      },
    },

    '/api/marketing/lead-scoring': crud('Lead Scoring'),
    '/api/marketing/lead-scoring/{id}': byId('Lead Scoring'),

    '/api/marketing/social-integration': crud('Social Integration'),
    '/api/marketing/social-integration/status/{userId}': {
      get: {
        tags: ['Social Integration'],
        summary: 'Get integration status by user',
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/api/marketing/social-integration/connect': {
      post: {
        tags: ['Social Integration'],
        summary: 'Connect social account',
        requestBody: jsonBody,
        responses: { 200: { description: 'Success' } },
      },
    },
    '/api/marketing/social-integration/{id}': byId('Social Integration'),

    '/api/marketing/social-posts': crud('Social Posts'),
    '/api/marketing/social-posts/publish': {
      post: {
        tags: ['Social Posts'],
        summary: 'Publish to platform',
        requestBody: jsonBody,
        responses: { 200: { description: 'Success' } },
      },
    },
    '/api/marketing/social-posts/{id}': byId('Social Posts'),

    '/api/marketing/workflows': crud('Workflows'),
    '/api/marketing/workflows/{id}': byId('Workflows'),

    '/api/rengrowcure/venture-matrix': crud('Venture Matrix'),
    '/api/rengrowcure/venture-matrix/analytics': {
      get: { tags: ['Venture Matrix'], summary: 'Venture matrix analytics', responses: { 200: { description: 'Success' } } },
    },
    '/api/rengrowcure/venture-matrix/{id}': byId('Venture Matrix'),
    '/api/rengrowcure/venture-matrix/{id}/stage': {
      patch: {
        tags: ['Venture Matrix'],
        summary: 'Update stage',
        parameters: [idParam],
        requestBody: jsonBody,
        responses: { 200: { description: 'Updated' } },
      },
    },

    '/api/rengrowcure/lead-intel/seed-dynamic': {
      post: { tags: ['Lead Intel'], summary: 'Seed dynamic lead intel', responses: { 200: { description: 'Success' } } },
    },
    '/api/rengrowcure/lead-intel/bulk-delete': {
      post: { tags: ['Lead Intel'], summary: 'Bulk delete profiles', requestBody: jsonBody, responses: { 200: { description: 'Success' } } },
    },
    '/api/rengrowcure/lead-intel/rules': {
      get: { tags: ['Lead Intel'], summary: 'List rules', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Lead Intel'], summary: 'Create rule', requestBody: jsonBody, responses: { 201: { description: 'Created' } } },
    },
    '/api/rengrowcure/lead-intel/rules/bulk-delete': {
      post: { tags: ['Lead Intel'], summary: 'Bulk delete rules', requestBody: jsonBody, responses: { 200: { description: 'Success' } } },
    },
    '/api/rengrowcure/lead-intel/rules/{id}': {
      put: { tags: ['Lead Intel'], summary: 'Update rule', parameters: [idParam], requestBody: jsonBody, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Lead Intel'], summary: 'Delete rule', parameters: [idParam], responses: { 200: { description: 'Deleted' } } },
    },
    '/api/rengrowcure/lead-intel/telemetry': {
      get: { tags: ['Lead Intel'], summary: 'List telemetry', responses: { 200: { description: 'Success' } } },
    },
    '/api/rengrowcure/lead-intel/telemetry/bulk-delete': {
      post: { tags: ['Lead Intel'], summary: 'Bulk delete telemetry', requestBody: jsonBody, responses: { 200: { description: 'Success' } } },
    },
    '/api/rengrowcure/lead-intel/telemetry/{id}': {
      delete: { tags: ['Lead Intel'], summary: 'Delete telemetry', parameters: [idParam], responses: { 200: { description: 'Deleted' } } },
    },
    '/api/rengrowcure/lead-intel/rules-count': {
      get: { tags: ['Lead Intel'], summary: 'Rules count', responses: { 200: { description: 'Success' } } },
    },
    '/api/rengrowcure/lead-intel': crud('Lead Intel', { listSummary: 'List profiles', createSummary: 'Create profile' }),
    '/api/rengrowcure/lead-intel/{id}': byId('Lead Intel'),

    '/api/rengrowcure/distro-engine': crud('Distro Engine'),
    '/api/rengrowcure/distro-engine/{id}': byId('Distro Engine'),

    '/api/rengrowcure/outreach-sequences': crud('Outreach Sequences'),
    '/api/rengrowcure/outreach-sequences/{id}': byId('Outreach Sequences'),

    '/api/rengrowcure/chronos': {
      get: { tags: ['Chronos'], summary: 'List chronos', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Chronos'], summary: 'Create chronos', requestBody: jsonBody, responses: { 201: { description: 'Created' } } },
    },

    '/api/rengrowcure/kinetics': crud('Kinetics'),
    '/api/rengrowcure/kinetics/{id}': byId('Kinetics'),

    '/api/tasks/analytics': {
      get: { tags: ['Tasks'], summary: 'Task analytics', responses: { 200: { description: 'Success' } } },
    },
    '/api/tasks': crud('Tasks'),
    '/api/tasks/{id}': byId('Tasks'),
    '/api/tasks/{id}/subtasks': {
      post: {
        tags: ['Tasks'],
        summary: 'Add subtask',
        parameters: [idParam],
        requestBody: jsonBody,
        responses: { 200: { description: 'Success' } },
      },
    },
    '/api/tasks/{id}/subtasks/{subtaskId}': {
      patch: {
        tags: ['Tasks'],
        summary: 'Toggle subtask',
        parameters: [
          idParam,
          { name: 'subtaskId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/api/tasks/{id}/comments': {
      post: {
        tags: ['Tasks'],
        summary: 'Add comment',
        parameters: [idParam],
        requestBody: jsonBody,
        responses: { 200: { description: 'Success' } },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [],
});

export default swaggerSpec;
