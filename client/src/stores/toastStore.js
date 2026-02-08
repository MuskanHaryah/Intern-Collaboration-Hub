import { create } from 'zustand';
import { persist } from 'zustand/middleware';

let toastId = 0;

const MAX_TOASTS = 5; // Maximum number of toasts to show at once

const useToastStore = create(
  persist(
    (set, get) => ({
      toasts: [],
      preferences: {
        soundEnabled: true,
        desktopNotifications: false,
        maxToasts: MAX_TOASTS,
        position: 'bottom-right', // top-left, top-right, top-center, bottom-left, bottom-right, bottom-center
      },

      // ============ TOAST MANAGEMENT ============

      // Add a toast notification
      addToast: (options) => {
        const {
          message,
          type = 'info',
          duration = 3000,
          persistent = false,
          action,
          actionLabel,
          onAction,
          icon,
          avatar,
          showProgress = false,
        } = typeof options === 'string' ? { message: options } : options;

        const id = ++toastId;
        const newToast = {
          id,
          message,
          type,
          duration: persistent ? null : duration,
          persistent,
          action,
          actionLabel,
          onAction,
          icon,
          avatar,
          showProgress,
          timestamp: Date.now(),
        };

        set((state) => {
          const toasts = [...state.toasts, newToast];
          // Limit number of toasts
          if (toasts.length > state.preferences.maxToasts) {
            return { toasts: toasts.slice(-state.preferences.maxToasts) };
          }
          return { toasts };
        });

        // Play sound if enabled
        if (get().preferences.soundEnabled) {
          get().playNotificationSound(type);
        }

        // Show desktop notification if enabled
        if (get().preferences.desktopNotifications) {
          get().showDesktopNotification(message, type);
        }

        return id;
      },

      // Remove a toast by id
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      // Update a toast by id
      updateToast: (id, updates) => {
        set((state) => ({
          toasts: state.toasts.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      // Clear all toasts
      clearToasts: () => {
        set({ toasts: [] });
      },

      // Clear toasts by type
      clearToastsByType: (type) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.type !== type),
        }));
      },

      // ============ SHORTHAND METHODS ============

      success: (message, options = {}) => {
        return get().addToast({
          message,
          type: 'success',
          duration: 3000,
          ...options,
        });
      },

      error: (message, options = {}) => {
        return get().addToast({
          message,
          type: 'error',
          duration: 5000,
          ...options,
        });
      },

      warning: (message, options = {}) => {
        return get().addToast({
          message,
          type: 'warning',
          duration: 4000,
          ...options,
        });
      },

      info: (message, options = {}) => {
        return get().addToast({
          message,
          type: 'info',
          duration: 3000,
          ...options,
        });
      },

      task: (message, options = {}) => {
        return get().addToast({
          message,
          type: 'task',
          duration: 3000,
          ...options,
        });
      },

      loading: (message, options = {}) => {
        return get().addToast({
          message,
          type: 'loading',
          persistent: true,
          showProgress: true,
          ...options,
        });
      },

      milestone: (message, options = {}) => {
        return get().addToast({
          message,
          type: 'milestone',
          duration: 4000,
          ...options,
        });
      },

      upload: (message, options = {}) => {
        return get().addToast({
          message,
          type: 'upload',
          duration: 3000,
          showProgress: true,
          ...options,
        });
      },

      // ============ PROMISE-BASED TOASTS ============

      /**
       * Show a loading toast, then update to success/error based on promise
       * Usage: toast.promise(fetchData(), { loading: 'Loading...', success: 'Done!', error: 'Failed!' })
       */
      promise: async (promise, messages) => {
        const { loading, success, error } = messages;
        const loadingToastId = get().loading(loading);

        try {
          const result = await promise;
          get().removeToast(loadingToastId);
          get().success(typeof success === 'function' ? success(result) : success);
          return result;
        } catch (err) {
          get().removeToast(loadingToastId);
          get().error(typeof error === 'function' ? error(err) : error);
          throw err;
        }
      },

      // ============ PREFERENCES ============

      updatePreferences: (updates) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        }));
      },

      toggleSound: () => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            soundEnabled: !state.preferences.soundEnabled,
          },
        }));
      },

      toggleDesktopNotifications: async () => {
        const current = get().preferences.desktopNotifications;
        
        if (!current && 'Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            set((state) => ({
              preferences: {
                ...state.preferences,
                desktopNotifications: true,
              },
            }));
          }
        } else {
          set((state) => ({
            preferences: {
              ...state.preferences,
              desktopNotifications: false,
            },
          }));
        }
      },

      setPosition: (position) => {
        set((state) => ({
          preferences: { ...state.preferences, position },
        }));
      },

      // ============ HELPER METHODS ============

      playNotificationSound: (type) => {
        // Simple beep sound using Web Audio API
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          // Different frequencies for different types
          const frequencies = {
            success: 800,
            error: 400,
            warning: 600,
            info: 500,
            task: 700,
            milestone: 900,
            loading: 550,
            upload: 650,
          };

          oscillator.frequency.value = frequencies[type] || 500;
          oscillator.type = 'sine';

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
          console.warn('⚠️ [ToastStore] Failed to play notification sound:', error);
        }
      },

      showDesktopNotification: (message, type) => {
        if ('Notification' in window && Notification.permission === 'granted') {
          const titles = {
            success: '✅ Success',
            error: '❌ Error',
            warning: '⚠️ Warning',
            info: 'ℹ️ Info',
            task: '📋 Task Update',
            milestone: '🎯 Milestone',
            loading: '⏳ Loading',
            upload: '📤 Upload',
          };

          new Notification(titles[type] || 'Notification', {
            body: message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `toast-${type}`,
            requireInteraction: false,
          });
        }
      },
    }),
    {
      name: 'toast-preferences',
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);

export default useToastStore;

// Export individual methods for convenience
export const toast = {
  success: (message, options) => useToastStore.getState().success(message, options),
  error: (message, options) => useToastStore.getState().error(message, options),
  warning: (message, options) => useToastStore.getState().warning(message, options),
  info: (message, options) => useToastStore.getState().info(message, options),
  task: (message, options) => useToastStore.getState().task(message, options),
  loading: (message, options) => useToastStore.getState().loading(message, options),
  milestone: (message, options) => useToastStore.getState().milestone(message, options),
  upload: (message, options) => useToastStore.getState().upload(message, options),
  promise: (promise, messages) => useToastStore.getState().promise(promise, messages),
  remove: (id) => useToastStore.getState().removeToast(id),
  clear: () => useToastStore.getState().clearToasts(),
};
