import Task from '../models/task.model.js';

export const createTaskService = async (taskData) => {
  const task = new Task(taskData);
  return await task.save();
};

export const getTasksService = async (query = {}) => {
  const {
    workspaceId,
    status,
    priority,
    moduleType,
    assigneeId,
    search,
    limit = 50,
    page = 1,
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  const filter = { isArchived: false };

  if (workspaceId) filter.workspaceId = workspaceId;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (moduleType) filter.moduleType = moduleType;
  if (assigneeId) filter.assignees = assigneeId;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  const skip = (page - 1) * limit;
  const sortOption = { [sortBy]: order === 'asc' ? 1 : -1 };

  const tasks = await Task.find(filter)
    .populate('assignees', 'name email avatar')
    .populate('reporter', 'name email')
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  const total = await Task.countDocuments(filter);

  return { tasks, total, page: Number(page), pages: Math.ceil(total / limit) };
};

export const getTaskByIdService = async (id) => {
  return await Task.findById(id)
    .populate('assignees', 'name email avatar')
    .populate('reporter', 'name email')
    .populate('comments.sender', 'name email avatar');
};

export const updateTaskService = async (id, updateData) => {
  if (updateData.status === 'DONE' && !updateData.completedAt) {
    updateData.completedAt = new Date();
  } else if (updateData.status && updateData.status !== 'DONE') {
    updateData.completedAt = null;
  }

  return await Task.findByIdAndUpdate(id, updateData, { new: true })
    .populate('assignees', 'name email avatar')
    .populate('reporter', 'name email');
};

export const deleteTaskService = async (id) => {
  return await Task.findByIdAndDelete(id);
};

export const addSubtaskService = async (taskId, title) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { $push: { subtasks: { title } } },
    { new: true }
  );
};

export const toggleSubtaskService = async (taskId, subtaskId, isCompleted) => {
  return await Task.findOneAndUpdate(
    { _id: taskId, 'subtasks._id': subtaskId },
    {
      $set: {
        'subtasks.$.isCompleted': isCompleted,
        'subtasks.$.completedAt': isCompleted ? new Date() : null,
      },
    },
    { new: true }
  );
};

export const addCommentService = async (taskId, senderId, text) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { $push: { comments: { sender: senderId, text } } },
    { new: true }
  ).populate('comments.sender', 'name email avatar');
};

export const getTaskAnalyticsService = async (workspaceId) => {
  const match = workspaceId ? { workspaceId } : {};

  const stats = await Task.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const priorityStats = await Task.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);

  const overdueCount = await Task.countDocuments({
    ...match,
    status: { $ne: 'DONE' },
    dueDate: { $lt: new Date() },
  });

  return { statusBreakdown: stats, priorityBreakdown: priorityStats, overdueCount };
};