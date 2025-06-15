/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        "dex-bg-primary": "var(--color-bg-primary)",
        "dex-bg-secondary": "var(--color-bg-secondary)",
        "dex-bg-tertiary": "var(--color-bg-tertiary)",
        "dex-bg-highlight": "var(--color-bg-highlight)",
        "dex-text-primary": "var(--color-text-primary)",
        "dex-text-secondary": "var(--color-text-secondary)",
        "dex-text-tertiary": "var(--color-text-tertiary)",
        "dex-border": "var(--color-border)",
        "dex-green": "var(--color-green)",
        "dex-red": "var(--color-red)",
        "dex-blue": "var(--color-blue)",
      },
    },
  },
  plugins: [],
};
