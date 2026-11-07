import { Router } from 'express';
import { DripCampaignsController } from '../controllers/drip-campaigns.controller.js';

const router = Router();

// Bulk dynamic testing generator & bulk deletion
router.post('/seed-dynamic', DripCampaignsController.seedData);
router.post('/bulk-delete', DripCampaignsController.bulkDelete);

// Standard RESTful routes
router.get('/', DripCampaignsController.getAll);
router.get('/:id', DripCampaignsController.getById);
router.post('/', DripCampaignsController.create);
router.put('/:id', DripCampaignsController.update);
router.patch('/:id/status', DripCampaignsController.updateStatus);
router.delete('/:id', DripCampaignsController.delete);

export const DripCampaignsRouter = router;
