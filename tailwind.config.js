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
                "wamellow": "#212226",
                "wamellow-light": "#383b42",
                "wamellow-semi": "#1b1c1f",
                "wamellow-alpha": "rgba(255, 255, 255, 0.06)",

                "blurple": "#5865f2",
                "blurple-dark": "#454fbf",

                "danger": "rgb(250, 100, 102, 0.8)",
                "danger-dark": "rgb(250, 100, 102, 0.4)"
            },
            width: {
                "128": "32rem",
                "160": "40rem"
            },
            animation: {
                marquee: "marquee 25s linear infinite",
                marquee2: "marquee2 25s linear infinite"
            },
            keyframes: {
                marquee: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-100%)" }
                },
                marquee2: {
                    "0%": { transform: "translateX(100%)" },
                    "100%": { transform: "translateX(0%)" }
                }
            }
        }
    },
    plugins: []
};