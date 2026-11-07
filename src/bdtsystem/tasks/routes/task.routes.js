import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addSubtask,
  toggleSubtask,
  addComment,
  getAnalytics,
} from '../controllers/task.controller.js';

const router = express.Router();

router.get('/analytics', getAnalytics);
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Subtasks & Comments Endpoints
router.post('/:id/subtasks', addSubtask);
router.patch('/:id/subtasks/:subtaskId', toggleSubtask);
router.post('/:id/comments', addComment);

export default router;