import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Initialize auth state from localStorage
      initialize: () => {
        console.log('🔐 [authStore] Initializing auth state...');
        try {
          const token = localStorage.getItem('token');
          const user = authService.getStoredUser();
          console.log('🔐 [authStore] Token:', token ? 'Present' : 'None');
          console.log('🔐 [authStore] User:', user ? user.email : 'None');
          if (token && user) {
            set({ user, token, isAuthenticated: true });
            console.log('✅ [authStore] Auth initialized with existing session');
          } else {
            // No valid token/user — ensure we're fully logged out
            set({ user: null, token: null, isAuthenticated: false });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('ℹ️ [authStore] No existing session, cleared stale state');
          }
        } catch (error) {
          console.error('❌ [authStore] Error during initialization:', error);
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      // Register new user
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.register(userData);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Login user
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.login(credentials);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Logout user
      logout: () => {
        authService.logout();
        localStorage.removeItem('auth-storage');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Update user profile
      updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.updateProfile(updates);
          set({ user: data.user, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Change password
      changePassword: async (passwords) => {
        set({ isLoading: true, error: null });
        try {
          await authService.changePassword(passwords);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Refresh user data
      refreshUser: async () => {
        try {
          const data = await authService.getMe();
          set({ user: data.user });
          return { success: true };
        } catch (error) {
          // If refresh fails, logout
          get().logout();
          return { success: false, error: error.message };
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
