import Task from '../models/Task.js';
import Project from '../models/Project.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, column, priority, assignees, labels, dueDate, checklist } = req.body;
    const { projectId } = req.params;

    // Check project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!project.isMember(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add tasks to this project',
      });
    }

    // Get the highest order in the column
    const lastTask = await Task.findOne({ project: projectId, column: column || 'todo' })
      .sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title,
      description,
      project: projectId,
      column: column || 'todo',
      order,
      priority,
      assignees,
      labels,
      dueDate,
      checklist,
      createdBy: req.user.id,
    });

    // Log activity
    task.logActivity(req.user.id, 'created', { title });
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`project-${projectId}`).emit('task:created', populatedTask);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask,
    });
  } catch (error) {
    console.error('Create task error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating task',
    });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { column, assignee, priority } = req.query;

    // Check project access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!project.isMember(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this project',
      });
    }

    // Build query
    const query = { project: projectId, isArchived: false };
    if (column) query.column = column;
    if (assignee) query.assignees = assignee;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ column: 1, order: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar')
      .populate('activity.user', 'name email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    if (!project.isMember(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this task',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching task',
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    const userRole = project.getUserRole(req.user.id);
    if (!userRole || userRole === 'viewer') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    const allowedUpdates = [
      'title', 'description', 'column', 'order', 'priority',
      'assignees', 'labels', 'dueDate', 'startDate',
      'estimatedHours', 'loggedHours', 'checklist',
    ];

    const updates = {};
    const changes = [];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (JSON.stringify(task[field]) !== JSON.stringify(req.body[field])) {
          changes.push({ field, from: task[field], to: req.body[field] });
        }
        updates[field] = req.body[field];
      }
    });

    task = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    // Log activity
    if (changes.length > 0) {
      task.logActivity(req.user.id, 'updated', { changes });
      await task.save();
    }

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`project-${task.project}`).emit('task:updated', task);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating task',
    });
  }
};

// @desc    Move task (change column/order) - for drag and drop
// @route   PUT /api/tasks/:id/move
// @access  Private
export const moveTask = async (req, res) => {
  try {
    const { column, order } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    const userRole = project.getUserRole(req.user.id);
    if (!userRole || userRole === 'viewer') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to move this task',
      });
    }

    const oldColumn = task.column;
    const oldOrder = task.order;

    // Update task position
    task.column = column;
    task.order = order;

    // Log activity if column changed
    if (oldColumn !== column) {
      task.logActivity(req.user.id, 'moved', {
        from: oldColumn,
        to: column,
      });
    }

    await task.save();

    // Reorder other tasks in the same column
    await Task.updateMany(
      {
        project: task.project,
        column: column,
        _id: { $ne: task._id },
        order: { $gte: order },
      },
      { $inc: { order: 1 } }
    );

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`project-${task.project}`).emit('task:moved', {
      task: populatedTask,
      oldColumn,
      oldOrder,
    });

    res.status(200).json({
      success: true,
      message: 'Task moved successfully',
      data: populatedTask,
    });
  } catch (error) {
    console.error('Move task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error moving task',
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    const userRole = project.getUserRole(req.user.id);
    if (!userRole || userRole === 'viewer') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    const projectId = task.project;
    await task.deleteOne();

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project-${projectId}`).emit('task:deleted', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting task',
    });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    if (!project.isMember(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to comment on this task',
      });
    }

    task.comments.push({
      user: req.user.id,
      text,
    });

    task.logActivity(req.user.id, 'commented', { text: text.substring(0, 50) });
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('comments.user', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project-${task.project}`).emit('task:commentAdded', {
      taskId: task._id,
      comment: updatedTask.comments[updatedTask.comments.length - 1],
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: updatedTask.comments[updatedTask.comments.length - 1],
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding comment',
    });
  }
};

// @desc    Toggle checklist item
// @route   PUT /api/tasks/:id/checklist/:itemId
// @access  Private
export const toggleChecklistItem = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    const userRole = project.getUserRole(req.user.id);
    if (!userRole || userRole === 'viewer') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    const item = task.checklist.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Checklist item not found',
      });
    }

    item.isCompleted = !item.isCompleted;
    item.completedAt = item.isCompleted ? new Date() : null;
    item.completedBy = item.isCompleted ? req.user.id : null;

    await task.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project-${task.project}`).emit('task:checklistUpdated', {
      taskId: task._id,
      checklist: task.checklist,
    });

    res.status(200).json({
      success: true,
      message: 'Checklist item toggled',
      data: task.checklist,
    });
  } catch (error) {
    console.error('Toggle checklist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating checklist',
    });
  }
};

// @desc    Upload file attachment to task
// @route   POST /api/tasks/:id/attachments
// @access  Private
export const uploadAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      // Delete uploaded file if task not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    const userRole = project.getUserRole(req.user.id);
    if (!userRole || userRole === 'viewer') {
      // Delete uploaded file if not authorized
      fs.unlinkSync(req.file.path);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload attachments to this task',
      });
    }

    // Create attachment object
    const attachment = {
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      type: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      uploadedAt: new Date(),
    };

    // Add attachment to task
    task.attachments.push(attachment);
    task.logActivity(req.user.id, 'attachment_added', { 
      fileName: req.file.originalname,
      fileSize: req.file.size 
    });
    await task.save();

    // Populate the uploaded attachment
    const populatedTask = await Task.findById(task._id)
      .populate('attachments.uploadedBy', 'name email avatar');

    const newAttachment = populatedTask.attachments[populatedTask.attachments.length - 1];

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project-${task.project}`).emit('task:attachmentAdded', {
      taskId: task._id,
      attachment: newAttachment,
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: newAttachment,
    });
  } catch (error) {
    console.error('Upload attachment error:', error);
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Server error uploading file',
    });
  }
};

// @desc    Delete file attachment from task
// @route   DELETE /api/tasks/:id/attachments/:attachmentId
// @access  Private
export const deleteAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    const userRole = project.getUserRole(req.user.id);
    if (!userRole || userRole === 'viewer') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete attachments from this task',
      });
    }

    // Find attachment
    const attachment = task.attachments.id(attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found',
      });
    }

    // Only the uploader, task creator, or project owner/admin can delete
    const isUploader = attachment.uploadedBy.toString() === req.user.id;
    const isTaskCreator = task.createdBy.toString() === req.user.id;
    const isOwnerOrAdmin = userRole === 'owner' || userRole === 'admin';

    if (!isUploader && !isTaskCreator && !isOwnerOrAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this attachment',
      });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../', attachment.url);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error('Error deleting file from filesystem:', error);
      }
    }

    // Remove attachment from task
    const fileName = attachment.name;
    task.attachments.pull(attachmentId);
    task.logActivity(req.user.id, 'attachment_deleted', { fileName });
    await task.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project-${task.project}`).emit('task:attachmentDeleted', {
      taskId: task._id,
      attachmentId,
    });

    res.status(200).json({
      success: true,
      message: 'Attachment deleted successfully',
    });
  } catch (error) {
    console.error('Delete attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting attachment',
    });
  }
};

// @desc    Download file attachment
// @route   GET /api/tasks/:id/attachments/:attachmentId/download
// @access  Private
export const downloadAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    if (!project.isMember(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    // Find attachment
    const attachment = task.attachments.id(attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found',
      });
    }

    // Get file path
    const filePath = path.join(__dirname, '../../', attachment.url);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server',
      });
    }

    // Set headers for download
    res.setHeader('Content-Type', attachment.type);
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.name}"`);
    
    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Download attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error downloading file',
    });
  }
};
