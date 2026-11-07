import { Router } from 'express';
import { KineticsController } from '../controllers/kinetics.controller.js';

const router = Router();

router.get('/', KineticsController.getAll);
router.get('/:id', KineticsController.getById);
router.post('/', KineticsController.create);
router.put('/:id', KineticsController.update);
router.delete('/:id', KineticsController.delete);

export const KineticsRouter = router;
