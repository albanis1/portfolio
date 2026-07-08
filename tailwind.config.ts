import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.md',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Tambahan kustom dapat ditambahkan di sini sesuai kebutuhan
    },
  },
  plugins: [],
};

export default config;