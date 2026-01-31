import Project from '../models/Project.js';
import Task from '../models/Task.js';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const { name, description, color, priority, dueDate, tags } = req.body;

    const project = await Project.create({
      name,
      description,
      color,
      priority,
      dueDate,
      tags,
      owner: req.user.id,
    });

    // Add project to user's projects array
    req.user.projects.push(project._id);
    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating project',
    });
  }
};

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    // Build query - get projects where user is owner or member
    const query = {
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id },
      ],
      isArchived: false,
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching projects',
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user has access
    if (!project.isMember(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project',
      });
    }

    // Get tasks for this project
    const tasks = await Task.find({ project: project._id, isArchived: false })
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...project.toObject(),
        tasks,
      },
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching project',
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check permission - only owner and admins can update
    const userRole = project.getUserRole(req.user.id);
    if (!userRole || (userRole !== 'owner' && userRole !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project',
      });
    }

    const allowedUpdates = [
      'name', 'description', 'status', 'priority', 'color',
      'dueDate', 'tags', 'taskColumns', 'milestones',
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    project = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`project-${project._id}`).emit('project:updated', project);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating project',
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Only owner can delete
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can delete this project',
      });
    }

    // Delete all tasks in project
    await Task.deleteMany({ project: project._id });

    // Delete project
    await project.deleteOne();

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project-${project._id}`).emit('project:deleted', project._id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting project',
    });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
export const addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check permission
    const userRole = project.getUserRole(req.user.id);
    if (userRole !== 'owner' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add members',
      });
    }

    // Check if user is already a member
    if (project.isMember(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project',
      });
    }

    project.members.push({
      user: userId,
      role: role || 'editor',
    });

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project-${project._id}`).emit('project:memberAdded', updatedProject);

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: updatedProject,
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding member',
    });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
export const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check permission
    const userRole = project.getUserRole(req.user.id);
    if (userRole !== 'owner' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members',
      });
    }

    // Cannot remove owner
    if (project.owner.toString() === req.params.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project owner',
      });
    }

    project.members = project.members.filter(
      (member) => member.user.toString() !== req.params.userId
    );

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project-${project._id}`).emit('project:memberRemoved', {
      project: updatedProject,
      removedUserId: req.params.userId,
    });

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: updatedProject,
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing member',
    });
  }
};
