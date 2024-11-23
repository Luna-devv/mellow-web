import { nextui } from "@nextui-org/react";
import twa from "tailwindcss-animate";

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
    			'wamellow': wamellow,
    			'wamellow-light': 'rgb(30, 32, 34)',
    			'wamellow-alpha': 'rgba(255, 255, 255, 0.06)',
    			'wamellow-100': '#e2e8f0',
    			'wamellow-100-light': '#ced3da',
    			'wamellow-100-alpha': 'rgba(0, 0, 0, 0.06)',
    			'wamellow-900-alpha': 'rgba(0, 0, 0, 0.54)',
    			'blurple': '#5865f2',
    			'blurple-dark': '#454fbf',
    			'discord-gray': '#1c1d23',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		width: {
    			'128': '32rem',
    			'160': '40rem'
    		},
    		fontSize: {
    			'xxs': '0.6rem'
    		}
    	}
    },
    darkMode: ["class"],
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
    }),
        twa
    ]
};

export default config;