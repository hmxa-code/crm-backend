import {
  createTaskService,
  getTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
  addSubtaskService,
  toggleSubtaskService,
  addCommentService,
  getTaskAnalyticsService,
} from '../services/task.services.js';

export const createTask = async (req, res, next) => {
  try {
    const task = await createTaskService({ ...req.body, reporter: req.user?._id || req.body.reporter });
    return res.status(201).json({ success: true, data: task, message: 'Task created successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const result = await getTasksService(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await getTaskByIdService(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await updateTaskService(req.params.id, req.body);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    return res.status(200).json({ success: true, data: task, message: 'Task updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await deleteTaskService(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    return res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addSubtask = async (req, res, next) => {
  try {
    const { title } = req.body;
    const task = await addSubtaskService(req.params.id, title);
    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const toggleSubtask = async (req, res, next) => {
  try {
    const { subtaskId } = req.params;
    const { isCompleted } = req.body;
    const task = await toggleSubtaskService(req.params.id, subtaskId, isCompleted);
    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const senderId = req.user?._id || req.body.senderId;
    const task = await addCommentService(req.params.id, senderId, req.body.text);
    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await getTaskAnalyticsService(req.query.workspaceId);
    return res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
};