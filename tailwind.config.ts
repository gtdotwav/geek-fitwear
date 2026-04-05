import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F5F1E8',
        'bg-secondary': '#E6DFD2',
        accent: '#C2A27C',
        'accent-mid': '#A88F6A',
        'accent-deep': '#8C7A5B',
        ink: '#1A1A1A',
        muted: '#6F6A5F',
        charcoal: '#2B2B2B',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-outfit)', 'Outfit', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        editorial: '0.15em',
      },
    },
  },
  plugins: [],
};

export default config;
