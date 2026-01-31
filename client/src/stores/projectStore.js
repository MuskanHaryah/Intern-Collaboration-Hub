import { create } from 'zustand';
import { projectService, taskService } from '../services';

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  tasks: [],
  isLoading: false,
  error: null,

  // Fetch all projects
  fetchProjects: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.getAll(params);
      set({ projects: data.projects, isLoading: false });
      return { success: true, projects: data.projects };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Fetch single project with tasks
  fetchProject: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const [projectData, tasksData] = await Promise.all([
        projectService.getById(projectId),
        taskService.getByProject(projectId),
      ]);
      set({
        currentProject: projectData.project,
        tasks: tasksData.tasks,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Create project
  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.create(projectData);
      set((state) => ({
        projects: [data.project, ...state.projects],
        isLoading: false,
      }));
      return { success: true, project: data.project };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update project
  updateProject: async (projectId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.update(projectId, updates);
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === projectId ? data.project : p
        ),
        currentProject:
          state.currentProject?._id === projectId
            ? data.project
            : state.currentProject,
        isLoading: false,
      }));
      return { success: true, project: data.project };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.delete(projectId);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== projectId),
        currentProject:
          state.currentProject?._id === projectId ? null : state.currentProject,
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Add member to project
  addMember: async (projectId, memberData) => {
    try {
      const data = await projectService.addMember(projectId, memberData);
      set((state) => ({
        currentProject:
          state.currentProject?._id === projectId
            ? data.project
            : state.currentProject,
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Remove member from project
  removeMember: async (projectId, userId) => {
    try {
      const data = await projectService.removeMember(projectId, userId);
      set((state) => ({
        currentProject:
          state.currentProject?._id === projectId
            ? data.project
            : state.currentProject,
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ============ TASK ACTIONS ============

  // Create task
  createTask: async (taskData) => {
    try {
      const data = await taskService.create(taskData);
      set((state) => ({
        tasks: [...state.tasks, data.task],
      }));
      return { success: true, task: data.task };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update task
  updateTask: async (taskId, updates) => {
    try {
      const data = await taskService.update(taskId, updates);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? data.task : t)),
      }));
      return { success: true, task: data.task };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      await taskService.delete(taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== taskId),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Move task (column/order change)
  moveTask: async (taskId, column, order) => {
    // Optimistic update
    const prevTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId ? { ...t, column, order } : t
      ),
    }));

    try {
      await taskService.move(taskId, { column, order });
      return { success: true };
    } catch (error) {
      // Rollback on error
      set({ tasks: prevTasks });
      return { success: false, error: error.message };
    }
  },

  // Add comment to task
  addComment: async (taskId, content) => {
    try {
      const data = await taskService.addComment(taskId, content);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? data.task : t)),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Toggle checklist item
  toggleChecklistItem: async (taskId, itemId) => {
    try {
      const data = await taskService.toggleChecklistItem(taskId, itemId);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? data.task : t)),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Set current project
  setCurrentProject: (project) => set({ currentProject: project }),

  // Clear current project
  clearCurrentProject: () => set({ currentProject: null, tasks: [] }),

  // Clear error
  clearError: () => set({ error: null }),

  // ============ REAL-TIME UPDATES (for Socket.IO) ============

  // Add task from socket
  addTaskFromSocket: (task) => {
    set((state) => {
      // Avoid duplicates
      if (state.tasks.find((t) => t._id === task._id)) return state;
      return { tasks: [...state.tasks, task] };
    });
  },

  // Update task from socket
  updateTaskFromSocket: (task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === task._id ? task : t)),
    }));
  },

  // Remove task from socket
  removeTaskFromSocket: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
    }));
  },

  // Update project from socket
  updateProjectFromSocket: (project) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p._id === project._id ? project : p
      ),
      currentProject:
        state.currentProject?._id === project._id
          ? project
          : state.currentProject,
    }));
  },
}));

export default useProjectStore;
