import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                warm: "#4b443e",
                mauve: "#8b7d7b",
                blush: "#f5e6e8",
                rose: "#d9a5b3",
                gold: "#e5d1b1",
                cream: "#fefbf6",
            },
            fontFamily: {
                display: ["var(--font-outfit)", "sans-serif"],
                body: ["var(--font-inter)", "sans-serif"],
            },
            animation: {
                "fade-up": "fade-up 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
                skeleton: "skeleton 1.5s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
export default config;
