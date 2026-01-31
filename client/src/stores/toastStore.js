import { create } from 'zustand';

let toastId = 0;

const useToastStore = create((set) => ({
  toasts: [],

  // Add a toast notification
  addToast: (message, type = 'info', duration = 3000) => {
    const id = ++toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    return id;
  },

  // Remove a toast by id
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Clear all toasts
  clearToasts: () => {
    set({ toasts: [] });
  },

  // Shorthand methods
  success: (message, duration) => {
    const id = ++toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'success', duration: duration || 3000 }],
    }));
    return id;
  },

  error: (message, duration) => {
    const id = ++toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'error', duration: duration || 4000 }],
    }));
    return id;
  },

  warning: (message, duration) => {
    const id = ++toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'warning', duration: duration || 3500 }],
    }));
    return id;
  },

  task: (message, duration) => {
    const id = ++toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'task', duration: duration || 3000 }],
    }));
    return id;
  },
}));

export default useToastStore;
