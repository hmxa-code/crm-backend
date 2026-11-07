import { Router } from 'express';
import { SocialIntegrationController } from '../controllers/social-integration.controller.js';

const router = Router();

router.get('/', SocialIntegrationController.getAll);
router.get('/status/:userId', SocialIntegrationController.getByUser);
router.get('/:id', SocialIntegrationController.getById);
router.post('/connect', SocialIntegrationController.connect);
router.post('/', SocialIntegrationController.create);
router.put('/:id', SocialIntegrationController.update);
router.delete('/:id', SocialIntegrationController.delete);

export const SocialIntegrationRouter = router;