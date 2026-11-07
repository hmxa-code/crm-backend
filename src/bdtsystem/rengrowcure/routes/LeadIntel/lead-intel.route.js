import { Router } from 'express';
import { LeadIntelController } from '../../controllers/LeadIntel/lead-intel.controller.js';

const router = Router();

// Bulk dynamic data generation for testing
router.post('/seed-dynamic', LeadIntelController.seedData);
router.post('/bulk-delete', LeadIntelController.bulkDelete);

// Rules endpoints (place specific subroutes before /:id)
router.get('/rules', LeadIntelController.getRules);
router.post('/rules/bulk-delete', LeadIntelController.bulkDeleteRules);
router.post('/rules', LeadIntelController.createRule);
router.put('/rules/:id', LeadIntelController.updateRule);
router.delete('/rules/:id', LeadIntelController.deleteRule);

// Telemetry endpoints
router.get('/telemetry', LeadIntelController.getTelemetry);
router.post('/telemetry/bulk-delete', LeadIntelController.bulkDeleteTelemetry);
router.delete('/telemetry/:id', LeadIntelController.deleteTelemetry);

// Rules count endpoint
router.get('/rules-count', LeadIntelController.getRulesCount);

// Profiles endpoints
router.get('/', LeadIntelController.getAll);
router.get('/:id', LeadIntelController.getById);
router.post('/', LeadIntelController.create);
router.put('/:id', LeadIntelController.update);
router.delete('/:id', LeadIntelController.delete);

export const LeadIntelRouter = router;
