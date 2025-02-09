import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";
import twa from "tailwindcss-animate";

const wamellow = "rgba(255, 255, 255, 0.05)";
const violet = "rgb(139 92 246)";

export default {
    darkMode: ["class", "class"],
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    plugins: [
        nextui({
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
                            DEFAULT: violet
                        },
                        default: {
                            foreground: "rgb(212 212 212)",
                            DEFAULT: wamellow
                        },
                        overlay: wamellow,
                        content1: wamellow,
                        content2: wamellow,
                        content3: wamellow,
                        content4: wamellow
                    }
                },
                violet: {
                    colors: {
                        default: {
                            foreground: "rgb(255 255 255)",
                            DEFAULT: violet
                        }
                    }
                }
            }
        }),
        twa
    ]
} satisfies Config;