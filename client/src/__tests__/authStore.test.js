import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuthStore from '../stores/authStore';
import { authService } from '../services';

// Mock authService
vi.mock('../services', () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
    getMe: vi.fn(),
    getStoredUser: vi.fn(),
  },
}));

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    // Clear mocks
    vi.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  describe('initialize', () => {
    it('should initialize with token and user from localStorage', () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      localStorage.setItem('token', 'test-token');
      authService.getStoredUser.mockReturnValue(mockUser);

      useAuthStore.getState().initialize();

      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().token).toBe('test-token');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should not initialize without token', () => {
      authService.getStoredUser.mockReturnValue(null);

      useAuthStore.getState().initialize();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const mockData = {
        user: { id: '1', email: 'test@example.com' },
        token: 'new-token',
      };
      authService.register.mockResolvedValue(mockData);

      const result = await useAuthStore.getState().register({
        email: 'test@example.com',
        password: 'Test123!',
      });

      expect(result.success).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockData.user);
      expect(useAuthStore.getState().token).toBe('new-token');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should handle registration error', async () => {
      authService.register.mockRejectedValue(new Error('Registration failed'));

      const result = await useAuthStore.getState().register({
        email: 'test@example.com',
        password: 'weak',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Registration failed');
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockData = {
        user: { id: '1', email: 'test@example.com' },
        token: 'auth-token',
      };
      authService.login.mockResolvedValue(mockData);

      const result = await useAuthStore.getState().login({
        email: 'test@example.com',
        password: 'Test123!',
      });

      expect(result.success).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockData.user);
      expect(useAuthStore.getState().token).toBe('auth-token');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should handle login error', async () => {
      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      const result = await useAuthStore.getState().login({
        email: 'test@example.com',
        password: 'wrong',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should clear user state on logout', () => {
      // Set authenticated state
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com' },
        token: 'token',
        isAuthenticated: true,
      });

      useAuthStore.getState().logout();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      useAuthStore.setState({ error: 'Some error' });

      useAuthStore.getState().clearError();

      expect(useAuthStore.getState().error).toBeNull();
    });
  });
});
