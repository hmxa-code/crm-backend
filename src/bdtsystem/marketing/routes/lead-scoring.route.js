import { Router } from 'express';
import { LeadScoringController } from '../controllers/lead-scoring.controller.js';

const router = Router();

router.get('/', LeadScoringController.getAll);
router.get('/:id', LeadScoringController.getById);
router.post('/', LeadScoringController.create);
router.put('/:id', LeadScoringController.update);
router.delete('/:id', LeadScoringController.delete);

export const LeadScoringRouter = router;