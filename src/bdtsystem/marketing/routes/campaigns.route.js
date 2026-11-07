import { Router } from 'express';
import { CampaignsController } from '../controllers/campaigns.controller.js';

const router = Router();

// Bulk dynamic testing generator & bulk deletion
router.post('/seed-dynamic', CampaignsController.seedData);
router.post('/bulk-delete', CampaignsController.bulkDelete);

// Standard RESTful routes
router.get('/', CampaignsController.getAll);
router.get('/:id', CampaignsController.getById);
router.post('/', CampaignsController.create);
router.put('/:id', CampaignsController.update);
router.patch('/:id/status', CampaignsController.updateStatus);
router.delete('/:id', CampaignsController.delete);

export const CampaignsRouter = router;
