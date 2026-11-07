import { Router } from 'express';
import { ChronosController } from '../controllers/chronos.controller.js';

const router = Router();

router.get('/', ChronosController.getAll);
router.post('/', ChronosController.create);

export const ChronosRouter = router;
