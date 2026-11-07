import { Router } from 'express';
import { OutreachSequencesController } from '../controllers/outreach-sequences.controller.js';

const router = Router();

router.get('/', OutreachSequencesController.getAll);
router.get('/:id', OutreachSequencesController.getById);
router.post('/', OutreachSequencesController.create);
router.put('/:id', OutreachSequencesController.update);
router.delete('/:id', OutreachSequencesController.delete);

export const OutreachSequencesRouter = router;
