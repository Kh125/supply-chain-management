/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary surface palette
        surface: {
          DEFAULT: '#0f172a', // slate-950 — page bg
          card:    '#1e293b', // slate-800 — cards
          raised:  '#334155', // slate-700 — elevated elements, inputs
          border:  '#475569', // slate-600 — borders
        },
        // Accent
        accent: {
          DEFAULT: '#6366f1', // indigo-500
          hover:   '#4f46e5', // indigo-600
          muted:   'rgba(99,102,241,0.15)',
          alt:     '#06b6d4', // cyan-500
        },
        // Text
        content: {
          primary:   '#f8fafc', // slate-50
          secondary: '#94a3b8', // slate-400
          muted:     '#64748b', // slate-500
        },
        // Status
        status: {
          pending:   '#eab308', // yellow-500
          accepted:  '#22c55e', // green-500
          shipped:   '#3b82f6', // blue-500
          delivered: '#94a3b8', // slate-400
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Kumbh Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(99,102,241,0.3)',
        'glow-sm':     '0 0 10px rgba(99,102,241,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}