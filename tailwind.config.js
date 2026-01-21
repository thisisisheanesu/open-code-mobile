/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(240 5.9% 90%)",
        input: "hsl(240 5.9% 90%)",
        ring: "hsl(240 5.9% 10%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(240 10% 3.9%)",
        primary: {
          DEFAULT: "hsl(240 5.9% 10%)",
          foreground: "hsl(0 0% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(240 4.8% 95.9%)",
          foreground: "hsl(240 5.9% 10%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(240 4.8% 95.9%)",
          foreground: "hsl(240 3.8% 46.1%)",
        },
        accent: {
          DEFAULT: "hsl(240 4.8% 95.9%)",
          foreground: "hsl(240 5.9% 10%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(240 10% 3.9%)",
        },
        success: {
          DEFAULT: "hsl(142 76% 36%)",
          foreground: "hsl(0 0% 98%)",
        },
        warning: {
          DEFAULT: "hsl(38 92% 50%)",
          foreground: "hsl(0 0% 98%)",
        },
        // Dark mode colors
        dark: {
          border: "hsl(240 3.7% 15.9%)",
          input: "hsl(240 3.7% 15.9%)",
          background: "hsl(240 10% 3.9%)",
          foreground: "hsl(0 0% 98%)",
          primary: {
            DEFAULT: "hsl(0 0% 98%)",
            foreground: "hsl(240 5.9% 10%)",
          },
          secondary: {
            DEFAULT: "hsl(240 3.7% 15.9%)",
            foreground: "hsl(0 0% 98%)",
          },
          muted: {
            DEFAULT: "hsl(240 3.7% 15.9%)",
            foreground: "hsl(240 5% 64.9%)",
          },
          accent: {
            DEFAULT: "hsl(240 3.7% 15.9%)",
            foreground: "hsl(0 0% 98%)",
          },
          card: {
            DEFAULT: "hsl(240 10% 3.9%)",
            foreground: "hsl(0 0% 98%)",
          },
        },
      },
      fontFamily: {
        mono: ["monospace"],
      },
    },
  },
  plugins: [],
};
