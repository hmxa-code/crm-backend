import { Router } from 'express';
import { VentureMatrixController } from '../controllers/venture-matrix.controller.js';

const router = Router();

router.get('/', VentureMatrixController.getAll);
router.get('/analytics', VentureMatrixController.getAnalytics);
router.get('/:id', VentureMatrixController.getById);
router.post('/', VentureMatrixController.create);
router.put('/:id', VentureMatrixController.update);
router.patch('/:id/stage', VentureMatrixController.updateStage);
router.delete('/:id', VentureMatrixController.delete);

export const VentureMatrixRouter = router;
