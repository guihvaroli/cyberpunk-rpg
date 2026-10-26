/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a0f',
          dark: '#12131a',
          surface: '#181924',
          card: '#151620',
          border: '#2a2c3d',
          yellow: '#FCEE0A',
          cyan: '#00F0FF',
          red: '#FF003C',
          green: '#00FF66',
          purple: '#BD00FF',
          orange: '#FF8800',
          muted: '#808599',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace', 'Courier New'],
      },
      boxShadow: {
        'neon-yellow': '0 0 10px rgba(252, 238, 10, 0.5), 0 0 20px rgba(252, 238, 10, 0.2)',
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.2)',
        'neon-red': '0 0 10px rgba(255, 0, 60, 0.5), 0 0 20px rgba(255, 0, 60, 0.2)',
        'neon-green': '0 0 10px rgba(0, 255, 102, 0.5), 0 0 20px rgba(0, 255, 102, 0.2)',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px currentColor)' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 2px currentColor)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
      animation: {
        glitch: 'glitch 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        pulseGlow: 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        scanline: 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
};
