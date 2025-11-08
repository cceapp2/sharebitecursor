import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7A00',
          light: '#FF9A33',
          dark: '#E66A00',
        },
        secondary: {
          DEFAULT: '#63D2C6',
          light: '#7FE0D4',
          dark: '#4FB8A8',
        },
        background: '#FFF8F3',
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
