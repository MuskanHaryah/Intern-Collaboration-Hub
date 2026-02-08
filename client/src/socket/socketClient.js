import { io } from 'socket.io-client';
import { useAuthStore } from '../stores';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

console.log('🔌 [socketClient.js] Socket client loaded');
console.log('🔌 [socketClient.js] SOCKET_URL:', SOCKET_URL);

let socket = null;

/**
 * Initialize socket connection with authentication
 */
export const initializeSocket = () => {
  console.log('🔌 [socketClient.js] initializeSocket called');
  const token = useAuthStore.getState().token;
  console.log('🔌 [socketClient.js] Token:', token ? 'Present' : 'None');
  
  if (!token) {
    console.warn('⚠️ [socketClient.js] No token available for socket connection');
    return null;
  }

  if (socket?.connected) {
    console.log('✅ [socketClient.js] Socket already connected');
    return socket;
  }

  console.log('🔌 [socketClient.js] Creating new socket connection...');
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('🔌 Socket connection error:', error.message);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔌 Socket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_error', (error) => {
    console.error('🔌 Socket reconnection error:', error.message);
  });

  return socket;
};

/**
 * Get the current socket instance
 */
export const getSocket = () => socket;

/**
 * Disconnect and cleanup socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Join a project room for real-time updates
 */
export const joinProject = (projectId) => {
  if (socket?.connected) {
    socket.emit('join-project', projectId);
    console.log('📢 Joined project room:', projectId);
  }
};

/**
 * Leave a project room
 */
export const leaveProject = (projectId) => {
  if (socket?.connected) {
    socket.emit('leave-project', projectId);
    console.log('📢 Left project room:', projectId);
  }
};

/**
 * Emit task created event
 */
export const emitTaskCreated = (task) => {
  if (socket?.connected) {
    socket.emit('task-created', task);
  }
};

/**
 * Emit task updated event
 */
export const emitTaskUpdated = (task) => {
  if (socket?.connected) {
    socket.emit('task-updated', task);
  }
};

/**
 * Emit task moved event
 */
export const emitTaskMoved = (taskId, projectId, column, order) => {
  if (socket?.connected) {
    socket.emit('task-moved', { taskId, projectId, column, order });
  }
};

/**
 * Emit task deleted event
 */
export const emitTaskDeleted = (taskId, projectId) => {
  if (socket?.connected) {
    socket.emit('task-deleted', { taskId, projectId });
  }
};

/**
 * Emit user started editing task
 */
export const emitStartEditingTask = (taskId, projectId) => {
  if (socket?.connected) {
    socket.emit('start-editing-task', { taskId, projectId });
  }
};

/**
 * Emit user stopped editing task
 */
export const emitStopEditingTask = (taskId, projectId) => {
  if (socket?.connected) {
    socket.emit('stop-editing-task', { taskId, projectId });
  }
};

/**
 * Emit user typing in task
 */
export const emitUserTyping = (projectId, taskId) => {
  if (socket?.connected) {
    socket.emit('user-typing', { projectId, taskId });
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  joinProject,
  leaveProject,
  emitTaskCreated,
  emitTaskUpdated,
  emitTaskMoved,
  emitTaskDeleted,
  emitStartEditingTask,
  emitStopEditingTask,
  emitUserTyping,
};
