import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
});

const commentSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED'],
      default: 'TODO',
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
      index: true,
    },
    moduleType: {
      type: String,
      enum: ['MARKETING', 'SALES', 'GENERAL'],
      default: 'GENERAL',
    },
    relatedEntity: {
      entityType: { type: String, enum: ['Lead', 'Deal', 'Property', 'Campaign', null], default: null },
      entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: { type: Date },
    dueDate: { type: Date, index: true },
    completedAt: { type: Date },
    estimatedHours: { type: Number, default: 0 },
    loggedHours: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    subtasks: [subtaskSchema],
    comments: [commentSchema],
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

taskSchema.index({ workspaceId: 1, status: 1, priority: 1 });
taskSchema.index({ assignees: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;