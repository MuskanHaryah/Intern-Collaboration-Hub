import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Task title cannot be empty'],
      maxlength: [200, 'Task title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    column: {
      type: String,
      default: 'todo',
    },
    order: {
      type: Number,
      default: 0,
    },
    assignees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    labels: [{
      name: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: '#b026ff',
      },
    }],
    dueDate: {
      type: Date,
      default: null,
    },
    startDate: {
      type: Date,
      default: null,
    },
    estimatedHours: {
      type: Number,
      default: null,
    },
    loggedHours: {
      type: Number,
      default: 0,
    },
    checklist: [{
      text: {
        type: String,
        required: true,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
      completedAt: Date,
      completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
    attachments: [{
      name: String,
      url: String,
      type: String,
      size: Number,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: Date,
      isEdited: {
        type: Boolean,
        default: false,
      },
    }],
    activity: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      action: {
        type: String,
        required: true,
      },
      details: mongoose.Schema.Types.Mixed,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
    isArchived: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Log activity helper
taskSchema.methods.logActivity = function (userId, action, details = {}) {
  this.activity.push({
    user: userId,
    action,
    details,
    timestamp: new Date(),
  });
};

// Calculate checklist progress
taskSchema.methods.getChecklistProgress = function () {
  if (this.checklist.length === 0) return null;
  const completed = this.checklist.filter((item) => item.isCompleted).length;
  return {
    completed,
    total: this.checklist.length,
    percentage: Math.round((completed / this.checklist.length) * 100),
  };
};

// Get task summary for lists
taskSchema.methods.getSummary = function () {
  return {
    id: this._id,
    title: this.title,
    column: this.column,
    order: this.order,
    priority: this.priority,
    labels: this.labels,
    dueDate: this.dueDate,
    assignees: this.assignees,
    checklistProgress: this.getChecklistProgress(),
    commentCount: this.comments.length,
    hasDescription: !!this.description,
  };
};

// Indexes for faster queries
taskSchema.index({ project: 1, column: 1, order: 1 });
taskSchema.index({ project: 1, isArchived: 1 });
taskSchema.index({ assignees: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });

// Pre-save middleware to set completedAt
taskSchema.pre('save', function (next) {
  if (this.isModified('column') && this.column === 'done' && !this.completedAt) {
    this.completedAt = new Date();
  } else if (this.isModified('column') && this.column !== 'done') {
    this.completedAt = null;
  }
  next();
});

export default mongoose.model('Task', taskSchema);
