import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {
    // The project the user is invited to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    // Who sent the invitation
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Who is being invited
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Role the invitee will have
    role: {
      type: String,
      enum: ['admin', 'editor', 'viewer'],
      default: 'editor',
    },
    // Invitation status
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
    // Optional message from sender
    message: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    // When the invitation was responded to
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending invitations
invitationSchema.index(
  { project: 1, recipient: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
);
invitationSchema.index({ recipient: 1, status: 1 });
invitationSchema.index({ sender: 1 });

export default mongoose.model('Invitation', invitationSchema);
