import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Socket.IO event handlers
export const setupSocketHandlers = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.name} (${socket.id})`);

    // Store user's socket id for direct messaging
    socket.join(`user-${socket.user._id}`);

    // ===== PROJECT EVENTS =====

    // Join a project room
    socket.on('project:join', (projectId) => {
      socket.join(`project-${projectId}`);
      console.log(`👤 ${socket.user.name} joined project: ${projectId}`);
      
      // Notify others in the project
      socket.to(`project-${projectId}`).emit('project:userJoined', {
        user: {
          id: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
        timestamp: new Date(),
      });
    });

    // Leave a project room
    socket.on('project:leave', (projectId) => {
      socket.leave(`project-${projectId}`);
      console.log(`👤 ${socket.user.name} left project: ${projectId}`);
      
      socket.to(`project-${projectId}`).emit('project:userLeft', {
        userId: socket.user._id,
        timestamp: new Date(),
      });
    });

    // ===== TASK EVENTS =====

    // Task being edited (show indicator to others)
    socket.on('task:startEdit', ({ projectId, taskId }) => {
      socket.to(`project-${projectId}`).emit('task:userEditing', {
        taskId,
        user: {
          id: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
      });
    });

    // Task editing stopped
    socket.on('task:stopEdit', ({ projectId, taskId }) => {
      socket.to(`project-${projectId}`).emit('task:userStoppedEditing', {
        taskId,
        userId: socket.user._id,
      });
    });

    // Real-time task drag (show ghost to others)
    socket.on('task:dragging', ({ projectId, taskId, position }) => {
      socket.to(`project-${projectId}`).emit('task:beingDragged', {
        taskId,
        position,
        user: {
          id: socket.user._id,
          name: socket.user.name,
        },
      });
    });

    // Task drag ended
    socket.on('task:dragEnd', ({ projectId, taskId }) => {
      socket.to(`project-${projectId}`).emit('task:dragEnded', {
        taskId,
        userId: socket.user._id,
      });
    });

    // ===== TYPING INDICATORS =====

    // User is typing a comment
    socket.on('task:typing', ({ projectId, taskId }) => {
      socket.to(`project-${projectId}`).emit('task:userTyping', {
        taskId,
        user: {
          id: socket.user._id,
          name: socket.user.name,
        },
      });
    });

    // User stopped typing
    socket.on('task:stopTyping', ({ projectId, taskId }) => {
      socket.to(`project-${projectId}`).emit('task:userStoppedTyping', {
        taskId,
        userId: socket.user._id,
      });
    });

    // ===== CURSOR/PRESENCE =====

    // Broadcast cursor position (for collaborative editing)
    socket.on('cursor:move', ({ projectId, position }) => {
      socket.to(`project-${projectId}`).emit('cursor:updated', {
        userId: socket.user._id,
        userName: socket.user.name,
        position,
      });
    });

    // ===== NOTIFICATIONS =====

    // Send notification to specific user
    socket.on('notification:send', ({ userId, notification }) => {
      io.to(`user-${userId}`).emit('notification:received', {
        ...notification,
        from: {
          id: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
        timestamp: new Date(),
      });
    });

    // ===== DISCONNECT =====

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.user.name} (${socket.id})`);
      
      // Broadcast to all rooms the user was in
      socket.rooms.forEach((room) => {
        if (room.startsWith('project-')) {
          socket.to(room).emit('project:userLeft', {
            userId: socket.user._id,
            timestamp: new Date(),
          });
        }
      });
    });

    // ===== ERROR HANDLING =====

    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.user.name}:`, error);
    });
  });

  return io;
};

// Helper function to emit to project room
export const emitToProject = (io, projectId, event, data) => {
  io.to(`project-${projectId}`).emit(event, data);
};

// Helper function to emit to specific user
export const emitToUser = (io, userId, event, data) => {
  io.to(`user-${userId}`).emit(event, data);
};

// Helper function to get online users in a project
export const getProjectOnlineUsers = async (io, projectId) => {
  const sockets = await io.in(`project-${projectId}`).fetchSockets();
  return sockets.map((socket) => ({
    id: socket.user._id,
    name: socket.user.name,
    avatar: socket.user.avatar,
    socketId: socket.id,
  }));
};
