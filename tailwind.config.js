/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                "wamellow": "rgb(23, 24, 28)",
                "wamellow-light": "rgb(33, 34, 38)",
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
                "blurple-dark": "#454fbf",

                "danger": "rgb(250, 100, 102, 0.8)",
                "danger-dark": "rgb(250, 100, 102, 0.4)"
            },
            width: {
                "128": "32rem",
                "160": "40rem"
            },
            fontSize: {
                "xxs": "0.6rem"
            },
            animation: {
                marquee: "marquee 35s linear infinite",
                marquee2: "marquee2 35s linear infinite",

                "marquee-reverse": "marquee-reverse 35s linear infinite",
                "marquee-reverse2": "marquee-reverse2 35s linear infinite"
            },
            keyframes: {
                marquee: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-100%)" }
                },
                marquee2: {
                    "0%": { transform: "translateX(100%)" },
                    "100%": { transform: "translateX(0%)" }
                },

                "marquee-reverse": {
                    "100%": { transform: "translateX(0%)" },
                    "0%": { transform: "translateX(-100%)" }
                },
                "marquee-reverse2": {
                    "100%": { transform: "translateX(100%)" },
                    "0%": { transform: "translateX(0%)" }
                }
            }
        }
    },
    plugins: []
};