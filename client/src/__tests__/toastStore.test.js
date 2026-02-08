import { describe, it, expect, beforeEach, vi } from 'vitest';
import useToastStore from '../stores/toastStore';

describe('ToastStore', () => {
  beforeEach(() => {
    // Reset store state
    useToastStore.setState({
      toasts: [],
      preferences: {
        soundEnabled: false, // Disable sound for tests
        desktopNotifications: false,
        maxToasts: 5,
        position: 'bottom-right',
      },
    });
  });

  describe('addToast', () => {
    it('should add a toast with default options', () => {
      const id = useToastStore.getState().addToast('Test message');

      const toasts = useToastStore.getState().toasts;
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe('Test message');
      expect(toasts[0].type).toBe('info');
      expect(toasts[0].id).toBe(id);
    });

    it('should add a toast with custom options', () => {
      const id = useToastStore.getState().addToast({
        message: 'Custom toast',
        type: 'success',
        duration: 5000,
      });

      const toasts = useToastStore.getState().toasts;
      expect(toasts[0].message).toBe('Custom toast');
      expect(toasts[0].type).toBe('success');
      expect(toasts[0].duration).toBe(5000);
      expect(toasts[0].id).toBe(id);
    });

    it('should limit number of toasts to maxToasts', () => {
      // Add 7 toasts (more than maxToasts: 5)
      for (let i = 0; i < 7; i++) {
        useToastStore.getState().addToast(`Toast ${i}`);
      }

      const toasts = useToastStore.getState().toasts;
      expect(toasts).toHaveLength(5);
      // Should keep the last 5
      expect(toasts[0].message).toBe('Toast 2');
      expect(toasts[4].message).toBe('Toast 6');
    });

    it('should create persistent toast', () => {
      useToastStore.getState().addToast({
        message: 'Persistent',
        persistent: true,
      });

      const toast = useToastStore.getState().toasts[0];
      expect(toast.persistent).toBe(true);
      expect(toast.duration).toBeNull();
    });
  });

  describe('removeToast', () => {
    it('should remove toast by id', () => {
      const id1 = useToastStore.getState().addToast('Toast 1');
      const id2 = useToastStore.getState().addToast('Toast 2');

      useToastStore.getState().removeToast(id1);

      const toasts = useToastStore.getState().toasts;
      expect(toasts).toHaveLength(1);
      expect(toasts[0].id).toBe(id2);
    });
  });

  describe('updateToast', () => {
    it('should update toast by id', () => {
      const id = useToastStore.getState().addToast('Original message');

      useToastStore.getState().updateToast(id, {
        message: 'Updated message',
        type: 'success',
      });

      const toast = useToastStore.getState().toasts[0];
      expect(toast.message).toBe('Updated message');
      expect(toast.type).toBe('success');
    });
  });

  describe('clearToasts', () => {
    it('should clear all toasts', () => {
      useToastStore.getState().addToast('Toast 1');
      useToastStore.getState().addToast('Toast 2');
      useToastStore.getState().addToast('Toast 3');

      useToastStore.getState().clearToasts();

      expect(useToastStore.getState().toasts).toHaveLength(0);
    });
  });

  describe('clearToastsByType', () => {
    it('should clear toasts of specific type', () => {
      useToastStore.getState().success('Success toast');
      useToastStore.getState().error('Error toast 1');
      useToastStore.getState().error('Error toast 2');
      useToastStore.getState().info('Info toast');

      useToastStore.getState().clearToastsByType('error');

      const toasts = useToastStore.getState().toasts;
      expect(toasts).toHaveLength(2);
      expect(toasts.every((t) => t.type !== 'error')).toBe(true);
    });
  });

  describe('shorthand methods', () => {
    it('should create success toast', () => {
      useToastStore.getState().success('Success!');

      const toast = useToastStore.getState().toasts[0];
      expect(toast.type).toBe('success');
      expect(toast.message).toBe('Success!');
      expect(toast.duration).toBe(3000);
    });

    it('should create error toast', () => {
      useToastStore.getState().error('Error!');

      const toast = useToastStore.getState().toasts[0];
      expect(toast.type).toBe('error');
      expect(toast.message).toBe('Error!');
      expect(toast.duration).toBe(5000);
    });

    it('should create warning toast', () => {
      useToastStore.getState().warning('Warning!');

      const toast = useToastStore.getState().toasts[0];
      expect(toast.type).toBe('warning');
      expect(toast.message).toBe('Warning!');
      expect(toast.duration).toBe(4000);
    });

    it('should create info toast', () => {
      useToastStore.getState().info('Info!');

      const toast = useToastStore.getState().toasts[0];
      expect(toast.type).toBe('info');
      expect(toast.message).toBe('Info!');
    });
  });

  describe('preferences', () => {
    it('should update preferences', () => {
      useToastStore.getState().updatePreferences({
        soundEnabled: true,
        maxToasts: 10,
      });

      const prefs = useToastStore.getState().preferences;
      expect(prefs.soundEnabled).toBe(true);
      expect(prefs.maxToasts).toBe(10);
    });

    it('should update position', () => {
      useToastStore.getState().updatePreferences({
        position: 'top-center',
      });

      expect(useToastStore.getState().preferences.position).toBe('top-center');
    });
  });
});
