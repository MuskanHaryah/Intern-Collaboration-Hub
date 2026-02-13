import express from 'express';
import Invitation from '../models/Invitation.js';
import Notification from '../models/Notification.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// @desc    Send a project invitation
// @route   POST /api/invitations
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { projectId, recipientId, role, message } = req.body;

    // Validate project exists
    const project = await Project.findById(projectId).populate('owner', 'name email');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check sender has permission (must be owner or admin)
    const userRole = project.getUserRole(req.user.id);
    if (userRole !== 'owner' && userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to invite members' });
    }

    // Check recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user is already a member
    if (project.isMember(recipientId)) {
      return res.status(400).json({ success: false, message: 'User is already a member of this project' });
    }

    // Check for existing pending invitation
    const existingInvitation = await Invitation.findOne({
      project: projectId,
      recipient: recipientId,
      status: 'pending',
    });
    if (existingInvitation) {
      return res.status(400).json({ success: false, message: 'An invitation is already pending for this user' });
    }

    // Create the invitation
    const invitation = await Invitation.create({
      project: projectId,
      sender: req.user.id,
      recipient: recipientId,
      role: role || 'editor',
      message: message || '',
    });

    // Create notification for the recipient
    const sender = await User.findById(req.user.id).select('name');
    const notification = await Notification.create({
      recipient: recipientId,
      sender: req.user.id,
      type: 'project_invitation',
      project: projectId,
      invitation: invitation._id,
      message: `${sender.name} invited you to join "${project.name}"`,
    });

    // Emit socket event to recipient
    const io = req.app.get('io');
    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'name email avatar')
      .populate('project', 'name description color status priority owner')
      .populate('invitation');

    io.to(`user-${recipientId}`).emit('notification:new', populatedNotification);

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      data: invitation,
    });
  } catch (error) {
    console.error('Send invitation error:', error);
    res.status(500).json({ success: false, message: 'Server error sending invitation' });
  }
});

// @desc    Get pending invitations for current user
// @route   GET /api/invitations/received
// @access  Private
router.get('/received', async (req, res) => {
  try {
    const invitations = await Invitation.find({
      recipient: req.user.id,
      status: 'pending',
    })
      .populate('project', 'name description color status priority')
      .populate('sender', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: invitations });
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get sent invitations by current user
// @route   GET /api/invitations/sent
// @access  Private
router.get('/sent', async (req, res) => {
  try {
    const invitations = await Invitation.find({ sender: req.user.id })
      .populate('project', 'name description color')
      .populate('recipient', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: invitations });
  } catch (error) {
    console.error('Get sent invitations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Accept an invitation
// @route   PUT /api/invitations/:id/accept
// @access  Private
router.put('/:id/accept', async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id)
      .populate('project', 'name')
      .populate('sender', 'name email');

    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    // Only recipient can accept
    if (invitation.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Invitation has already been responded to' });
    }

    // Update invitation status
    invitation.status = 'accepted';
    invitation.respondedAt = new Date();
    await invitation.save();

    // Add user to project
    const project = await Project.findById(invitation.project._id || invitation.project);
    if (project) {
      project.members.push({
        user: req.user.id,
        role: invitation.role,
      });
      await project.save();
    }

    // Notify the sender that invitation was accepted
    const recipient = await User.findById(req.user.id).select('name');
    const senderNotification = await Notification.create({
      recipient: invitation.sender._id || invitation.sender,
      sender: req.user.id,
      type: 'invitation_accepted',
      project: invitation.project._id || invitation.project,
      invitation: invitation._id,
      message: `${recipient.name} accepted your invitation to "${invitation.project.name || 'the project'}"`,
    });

    // Mark the original invitation notification as read
    await Notification.updateMany(
      { invitation: invitation._id, recipient: req.user.id },
      { read: true }
    );

    // Emit socket events
    const io = req.app.get('io');
    const populatedSenderNotif = await Notification.findById(senderNotification._id)
      .populate('sender', 'name email avatar')
      .populate('project', 'name description color');

    io.to(`user-${invitation.sender._id || invitation.sender}`).emit('notification:new', populatedSenderNotif);

    // Also emit project update
    const updatedProject = await Project.findById(invitation.project._id || invitation.project)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');
    io.to(`project-${invitation.project._id || invitation.project}`).emit('project:memberAdded', updatedProject);

    res.status(200).json({ success: true, message: 'Invitation accepted', data: invitation });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Decline an invitation
// @route   PUT /api/invitations/:id/decline
// @access  Private
router.put('/:id/decline', async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id)
      .populate('project', 'name')
      .populate('sender', 'name email');

    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    if (invitation.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Invitation has already been responded to' });
    }

    invitation.status = 'declined';
    invitation.respondedAt = new Date();
    await invitation.save();

    // Notify the sender
    const recipient = await User.findById(req.user.id).select('name');
    const senderNotification = await Notification.create({
      recipient: invitation.sender._id || invitation.sender,
      sender: req.user.id,
      type: 'invitation_declined',
      project: invitation.project._id || invitation.project,
      invitation: invitation._id,
      message: `${recipient.name} declined your invitation to "${invitation.project.name || 'the project'}"`,
    });

    // Mark original notification as read
    await Notification.updateMany(
      { invitation: invitation._id, recipient: req.user.id },
      { read: true }
    );

    // Emit socket event
    const io = req.app.get('io');
    const populatedSenderNotif = await Notification.findById(senderNotification._id)
      .populate('sender', 'name email avatar')
      .populate('project', 'name description color');

    io.to(`user-${invitation.sender._id || invitation.sender}`).emit('notification:new', populatedSenderNotif);

    res.status(200).json({ success: true, message: 'Invitation declined', data: invitation });
  } catch (error) {
    console.error('Decline invitation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
