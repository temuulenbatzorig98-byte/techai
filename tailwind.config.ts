import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#7c3aed',
          'purple-light': '#a78bfa',
          cyan: '#06b6d4',
          'cyan-light': '#67e8f9',
          dark: '#0d1220',
          card: '#111827',
          'card-light': '#f8fafc',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.3), transparent)',
        'gradient-brand': 'linear-gradient(135deg, #7c3aed, #06b6d4)',
      },
      boxShadow: {
        'card-hover': '0 16px 48px rgba(124, 58, 237, 0.13), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover-dark': '0 16px 48px rgba(124, 58, 237, 0.25), 0 4px 16px rgba(0,0,0,0.45)',
        'btn-primary': '0 4px 20px rgba(124, 58, 237, 0.35)',
        'btn-primary-hover': '0 8px 30px rgba(124, 58, 237, 0.5)',
        'form-card': '0 4px 24px rgba(0,0,0,0.06), 0 1px 8px rgba(0,0,0,0.04)',
        'form-card-dark': '0 4px 24px rgba(0,0,0,0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'slide-down': 'slideDown 0.22s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(6,182,212,0.4)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
export default config
