import { nextui } from "@nextui-org/react";

const wamellow = "rgba(255, 255, 255, 0.05)";
const violet = "rgb(139 92 246)";

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                "wamellow": wamellow,
                "wamellow-light": "rgb(30, 32, 34)",
                "wamellow-alpha": "rgba(255, 255, 255, 0.06)",

                "wamellow-100": "#e2e8f0",
                "wamellow-100-light": "#ced3da",
                "wamellow-100-alpha": "rgba(0, 0, 0, 0.06)",

                "wamellow-200": "#cdd5e1",
                "wamellow-200-light": "#b4becb",
                "wamellow-200-alpha": "rgba(0, 0, 0, 0.12)",
                "wamellow-300-alpha": "rgba(0, 0, 0, 0.18)",
                "wamellow-400-alpha": "rgba(0, 0, 0, 0.24)",
                "wamellow-500-alpha": "rgba(0, 0, 0, 0.3)",
                "wamellow-600-alpha": "rgba(0, 0, 0, 0.36)",
                "wamellow-700-alpha": "rgba(0, 0, 0, 0.42)",
                "wamellow-800-alpha": "rgba(0, 0, 0, 0.48)",
                "wamellow-900-alpha": "rgba(0, 0, 0, 0.54)",

                "blurple": "#5865f2",
                "blurple-dark": "#454fbf"
            },
            width: {
                "128": "32rem",
                "160": "40rem"
            },
            fontSize: {
                "xxs": "0.6rem"
            }
        }
    },
    darkMode: "class",
    plugins: [nextui({
        addCommonColors: false,
        layout: {
            radius: {
                small: "0.375rem",
                medium: "0.5rem",
                large: "0.75rem"
            },
            fontSize: {
                small: "0.875rem",
                medium: "1rem",
                large: "1.125rem"
            }
        },
        themes: {
            dark: {
                colors: {
                    secondary: {
                        foreground: "rgb(255 255 255)",
                        background: wamellow,
                        DEFAULT: violet,
                        divider: wamellow,
                        focus: violet
                    },
                    default: {
                        foreground: "rgb(212 212 212)",
                        background: wamellow,
                        DEFAULT: wamellow,
                        focus: violet
                    },
                    overlay: wamellow,
                    content1: wamellow,
                    content2: wamellow,
                    content3: wamellow,
                    content4: wamellow
                }
            },
            violet: {
                extends: "dark",
                colors: {
                    default: {
                        foreground: "rgb(255 255 255)",
                        background: wamellow,
                        DEFAULT: violet
                    }
                }
            }
        }
    })]
};

export default config;