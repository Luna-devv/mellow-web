import twa from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
    	extend: {
    		colors: {
    			blurple: '#5865f2',
    			'blurple-dark': '#454fbf',
    			'discord-gray': '#1c1d23',
    			foreground: 'hsl(var(--foreground))',
    			wamellow: {
    				DEFAULT: 'var(--wamellow)'
    			},
    			'wamellow-100': {
    				DEFAULT: 'var(--wamellow-100)'
    			},
    			'wamellow-200': {
    				DEFAULT: 'var(--wamellow-200)'
    			},
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
    			flat: {
    				DEFAULT: 'hsl(var(--flat))',
    				foreground: 'hsl(var(--flat-foreground))'
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
    			separator: 'hsl(var(--separator))',
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
    			xxs: '0.6rem',
                medium: "1rem"
    		},
            lineHeight: {
                medium: "1.5rem"
            },
    		animation: {
    			progress: 'progress 1s infinite linear',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		},
    		keyframes: {
    			progress: {
    				'0%': {
    					transform: ' translateX(0) scaleX(0)'
    				},
    				'40%': {
    					transform: 'translateX(0) scaleX(0.4)'
    				},
    				'100%': {
    					transform: 'translateX(100%) scaleX(0.5)'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		transformOrigin: {
    			'left-right': '0% 50%'
    		}
    	}
    },
    darkMode: ["class"],
    plugins: [
        twa
    ]
};

export default config;