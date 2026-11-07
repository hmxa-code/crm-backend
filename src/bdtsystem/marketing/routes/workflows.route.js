import { Router } from 'express';
import { WorkflowsController } from '../controllers/workflows.controller.js';

const router = Router();

router.get('/', WorkflowsController.getAll);
router.get('/:id', WorkflowsController.getById);
router.post('/', WorkflowsController.create);
router.put('/:id', WorkflowsController.update);
router.delete('/:id', WorkflowsController.delete);

export const WorkflowsRouter = router;