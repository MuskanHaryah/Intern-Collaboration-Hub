/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary backgrounds
        'dark-primary': '#0a0a0f',
        'dark-secondary': '#12121a',
        'dark-tertiary': '#1a1a2e',
        'dark-card': '#16162a',
        
        // Neon accents
        'neon-purple': '#b026ff',
        'neon-pink': '#ff2d95',
        'neon-blue': '#00d4ff',
        'neon-cyan': '#0ff',
        'neon-green': '#00ff88',
        
        // Text colors
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0b0',
        'text-muted': '#6b6b7b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #b026ff 0%, #ff2d95 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(176, 38, 255, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(176, 38, 255, 0.5), 0 0 40px rgba(176, 38, 255, 0.3)',
        'neon-pink': '0 0 20px rgba(255, 45, 149, 0.5), 0 0 40px rgba(255, 45, 149, 0.3)',
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)',
        'glow-card': '0 0 15px rgba(176, 38, 255, 0.1), inset 0 0 15px rgba(176, 38, 255, 0.05)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
