import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['admin', 'editor', 'viewer'],
        default: 'editor',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    status: {
      type: String,
      enum: ['planning', 'active', 'on-hold', 'completed', 'archived'],
      default: 'planning',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    color: {
      type: String,
      default: '#b026ff', // Default neon purple
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    milestones: [{
      title: {
        type: String,
        required: true,
      },
      description: String,
      dueDate: Date,
      isCompleted: {
        type: Boolean,
        default: false,
      },
      completedAt: Date,
    }],
    taskColumns: {
      type: [{
        id: String,
        title: String,
        color: String,
        order: Number,
      }],
      default: [
        { id: 'todo', title: 'To Do', color: '#6b7280', order: 0 },
        { id: 'in-progress', title: 'In Progress', color: '#f59e0b', order: 1 },
        { id: 'review', title: 'Review', color: '#8b5cf6', order: 2 },
        { id: 'done', title: 'Done', color: '#10b981', order: 3 },
      ],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for tasks count
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
});

// Get project summary
projectSchema.methods.getSummary = function () {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    status: this.status,
    priority: this.priority,
    color: this.color,
    memberCount: this.members.length + 1, // +1 for owner
    startDate: this.startDate,
    dueDate: this.dueDate,
  };
};

// Check if user is member or owner
projectSchema.methods.isMember = function (userId) {
  if (this.owner.toString() === userId.toString()) return true;
  return this.members.some(
    (member) => member.user.toString() === userId.toString()
  );
};

// Get user's role in project
projectSchema.methods.getUserRole = function (userId) {
  if (this.owner.toString() === userId.toString()) return 'owner';
  const member = this.members.find(
    (m) => m.user.toString() === userId.toString()
  );
  return member ? member.role : null;
};

// Index for faster queries
projectSchema.index({ owner: 1 });
projectSchema.index({ 'members.user': 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ createdAt: -1 });

export default mongoose.model('Project', projectSchema);
