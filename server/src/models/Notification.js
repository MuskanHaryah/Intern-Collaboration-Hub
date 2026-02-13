import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // Who receives this notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Who triggered the notification
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Type of notification
    type: {
      type: String,
      enum: [
        'project_invitation',     // You've been invited to a project
        'invitation_accepted',    // Someone accepted your invitation
        'invitation_declined',    // Someone declined your invitation
        'member_added',           // You were added to a project (direct add)
        'member_removed',         // You were removed from a project
        'general',                // General notification
      ],
      required: true,
    },
    // Related project (for invitation-type notifications)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    // Related invitation
    invitation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invitation',
      default: null,
    },
    // Notification message
    message: {
      type: String,
      required: true,
    },
    // Has the user read this notification?
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });

export default mongoose.model('Notification', notificationSchema);
