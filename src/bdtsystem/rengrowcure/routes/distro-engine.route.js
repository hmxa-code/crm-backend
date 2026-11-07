import { Router } from 'express';
import { DistroEngineController } from '../controllers/distro-engine.controller.js';

const router = Router();

router.get('/', DistroEngineController.getAll);
router.get('/:id', DistroEngineController.getById);
router.post('/', DistroEngineController.create);
router.put('/:id', DistroEngineController.update);
router.delete('/:id', DistroEngineController.delete);

export const DistroEngineRouter = router;
