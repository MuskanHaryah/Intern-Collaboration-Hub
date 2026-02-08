import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // 'dark' | 'light'
      
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        
        // Apply to document
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      // Initialize theme from stored preference
      initializeTheme: () => {
        console.log('🎨 [themeStore] Initializing theme...');
        try {
          const { theme } = get();
          console.log('🎨 [themeStore] Current theme:', theme);
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            console.log('✅ [themeStore] Dark theme applied');
          } else {
            document.documentElement.classList.remove('dark');
            console.log('✅ [themeStore] Light theme applied');
          }
        } catch (error) {
          console.error('❌ [themeStore] Error during theme initialization:', error);
        }
      },

      isDark: () => get().theme === 'dark',
    }),
    {
      name: 'collabhub-theme',
    }
  )
);

export default useThemeStore;
