import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { 
  initializeSocket, 
  getSocket, 
  disconnectSocket,
  joinProject,
  leaveProject,
} from './socketClient';
import { useAuthStore, useProjectStore, useToastStore } from '../stores';

// Create context
const SocketContext = createContext(null);

/**
 * Socket Provider component - manages socket connection and event listeners
 */
export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [editingUsers, setEditingUsers] = useState({}); // { taskId: [users] }
  const { isAuthenticated, user } = useAuthStore();
  const { 
    addTaskFromSocket, 
    updateTaskFromSocket, 
    removeTaskFromSocket,
    updateProjectFromSocket,
  } = useProjectStore();
  const { addToast } = useToastStore();
  
  const currentProjectRef = useRef(null);

  // Initialize socket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const socket = initializeSocket();
      
      if (socket) {
        // Connection status handlers
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        // ============ TASK EVENT HANDLERS ============
        
        // Task created by another user
        socket.on('task-added', (task) => {
          console.log('📥 Task added:', task.title);
          addTaskFromSocket(task);
          addToast({
            type: 'info',
            message: `New task "${task.title}" created`,
            user: task.createdBy?.name || 'Someone',
          });
        });

        // Task updated by another user
        socket.on('task-changed', (task) => {
          console.log('📥 Task updated:', task.title);
          updateTaskFromSocket(task);
          addToast({
            type: 'info',
            message: `Task "${task.title}" was updated`,
          });
        });

        // Task moved by another user
        socket.on('task-position-changed', ({ taskId, column, order }) => {
          console.log('📥 Task moved:', taskId, 'to', column);
          updateTaskFromSocket({ _id: taskId, column, order });
        });

        // Task deleted by another user
        socket.on('task-removed', (taskId) => {
          console.log('📥 Task removed:', taskId);
          removeTaskFromSocket(taskId);
        });

        // ============ PROJECT EVENT HANDLERS ============

        // Project updated
        socket.on('project-updated', (project) => {
          console.log('📥 Project updated:', project.name);
          updateProjectFromSocket(project);
          addToast({
            type: 'info',
            message: `Project "${project.name}" was updated`,
          });
        });

        // Member joined project
        socket.on('member-joined', ({ projectId, member }) => {
          console.log('📥 Member joined:', member.name);
          addToast({
            type: 'success',
            message: `${member.name} joined the project`,
            user: member.name,
          });
        });

        // Member left project
        socket.on('member-left', ({ projectId, userId }) => {
          console.log('📥 Member left:', userId);
          addToast({
            type: 'info',
            message: 'A team member left the project',
          });
        });

        // ============ PRESENCE HANDLERS ============

        // User online status
        socket.on('user-online', (userData) => {
          setOnlineUsers((prev) => {
            if (prev.find((u) => u.id === userData.id)) return prev;
            return [...prev, userData];
          });
        });

        // User offline
        socket.on('user-offline', (userId) => {
          setOnlineUsers((prev) => prev.filter((u) => u.id !== userId));
        });

        // Users currently in project
        socket.on('project-users', (users) => {
          setOnlineUsers(users);
        });

        // ============ EDITING INDICATORS ============

        // User started editing a task
        socket.on('user-editing', ({ taskId, user: editingUser }) => {
          if (editingUser.id !== user?.id) {
            setEditingUsers((prev) => ({
              ...prev,
              [taskId]: [...(prev[taskId] || []), editingUser],
            }));
          }
        });

        // User stopped editing a task
        socket.on('user-stopped-editing', ({ taskId, userId }) => {
          setEditingUsers((prev) => ({
            ...prev,
            [taskId]: (prev[taskId] || []).filter((u) => u.id !== userId),
          }));
        });

        // User typing indicator
        socket.on('user-activity', ({ user: typingUser, action, taskId }) => {
          if (action === 'typing' && typingUser.id !== user?.id) {
            // Show typing indicator briefly
            setEditingUsers((prev) => ({
              ...prev,
              [taskId]: [...(prev[taskId] || []).filter((u) => u.id !== typingUser.id), { ...typingUser, isTyping: true }],
            }));

            // Clear typing indicator after 3 seconds
            setTimeout(() => {
              setEditingUsers((prev) => ({
                ...prev,
                [taskId]: (prev[taskId] || []).map((u) => 
                  u.id === typingUser.id ? { ...u, isTyping: false } : u
                ),
              }));
            }, 3000);
          }
        });

        // ============ ERROR HANDLERS ============

        socket.on('error', (error) => {
          console.error('🔌 Socket error:', error);
        });
      }

      return () => {
        disconnectSocket();
      };
    } else {
      disconnectSocket();
      setIsConnected(false);
      setOnlineUsers([]);
    }
  }, [isAuthenticated, user, addTaskFromSocket, updateTaskFromSocket, removeTaskFromSocket, updateProjectFromSocket, addToast]);

  // Join/leave project room
  const joinProjectRoom = useCallback((projectId) => {
    if (currentProjectRef.current) {
      leaveProject(currentProjectRef.current);
    }
    currentProjectRef.current = projectId;
    joinProject(projectId);
  }, []);

  const leaveProjectRoom = useCallback((projectId) => {
    leaveProject(projectId || currentProjectRef.current);
    currentProjectRef.current = null;
    setOnlineUsers([]);
    setEditingUsers({});
  }, []);

  // Check if a task is being edited by another user
  const isTaskBeingEdited = useCallback((taskId) => {
    const editors = editingUsers[taskId] || [];
    return editors.filter((e) => e.id !== user?.id).length > 0;
  }, [editingUsers, user]);

  // Get users editing a specific task
  const getTaskEditors = useCallback((taskId) => {
    return (editingUsers[taskId] || []).filter((e) => e.id !== user?.id);
  }, [editingUsers, user]);

  const value = {
    isConnected,
    onlineUsers,
    editingUsers,
    joinProjectRoom,
    leaveProjectRoom,
    isTaskBeingEdited,
    getTaskEditors,
    socket: getSocket(),
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

/**
 * Hook to access socket context
 */
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export default SocketContext;
