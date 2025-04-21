import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{jsx,tsx,mdx}",
    "./src/dock/**/*.{jsx,tsx,mdx}",
    "./src/components/**/*.{jsx,tsx,mdx}",
    "./public/icons/**/*.{jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'base-gradient': 'linear-gradient(rgb(56, 56, 59), rgb(56, 56, 59))',
        'border-gradient': 'linear-gradient(rgba(255,255,255,0.243) -1.67%, rgba(0,0,0,0.18) 24.54%, rgba(0,0,0,0.208) 62.15%, rgba(255,255,255,0.08) 100%)',
        'gold-gradient': 'radial-gradient(at right bottom, rgb(254, 219, 55) 0%, white 8%, rgb(189, 161, 86) 30%, rgb(230, 190, 138) 40%, transparent 80%), radial-gradient(at left top, rgb(255, 255, 255) 0%, rgb(255, 255, 172) 8%, rgb(230, 190, 138) 25%, rgb(93, 74, 31) 62.5%, rgb(230, 190, 138) 100%)'
      },
      backgroundClip: {
        text: 'text',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        xsm: "460px",
        xxsm: "230px"
      },
      colors: {
        p1: "hsl(var(--p1))",
        p2: "hsl(var(--p2))",
        s1: "hsl(var(--s1))",
        s2: "hsl(var(--s2))",
        a1: "hsl(var(--a1))",
        a2: "hsl(var(--a2))",
        a3: "hsl(var(--a3))",
        c1: "var(--c1)",
        home: "hsl(var(--home-bg))",
        "home-text": "hsl(var(--home-text))",
        "home-subtext": "hsl(var(--home-subtext))",
        "table-border-color": "hsl(var(--table-border-color))",
        "table-head-color": "hsl(var(--table-head-color))",
        "table-r1-color": "hsl(var(--table-r1-color))",
        "table-r2-color": "hsl(var(--table-r2-color))",
        "table-sticky-color": "hsl(var(--table-sticky-color))",
        "table-input-bg-color": "hsl(var(--table-input-bg-color))",
        btn: "hsl(var(--btn))",
        line: "hsl(var(--line))",
        logo: "hsl(var(--logo))",
        text: "hsl(var(--text))",
        txet: "hsl(var(--txet))",
        "btn-hover": "hsl(var(--btn-hover))",
        "btn-text": "hsl(var(--btn-text))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        pjs: ['"pjs"', "sans-serif"],
        bytesized: ['"bytesized"', '"pjs"', "sans-serif"]
      },
    },
    keyframes: {
      "slide-in-right": {
        "0%": {
          transform: "translateX(100%)",
          opacity: "0",
        },
        "100%": {
          transform: "translateX(0)",
          opacity: "1",
        },
      },
      "slide-out-right": {
        "0%": {
          transform: "translateX(0)",
          opacity: "1",
        },
        "100%": {
          transform: "translateX(100%)",
          opacity: "0",
        },
      },
    },
    animation: {
      "slide-in-right": "slide-in-right 0.3s ease-out",
      "slide-out-right": "slide-out-right 0.3s ease-out",
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/container-queries'),
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        ".scroll-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".scroll-hide::-webkit-scrollbar": {
          display: "none",
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;