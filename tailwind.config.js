import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [
		'dark',
		{ pattern: /-info/},
		{ pattern: /-observation/},
		{ pattern: /-feelings/},
		{ pattern: /-needs/},
		{ pattern: /-request/},
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontSize: {
				'2xs': '0.5rem'
			},
			colors: {
				'info-background': 'hsl(var(--info-background) / <alpha-value>)',
				'info-foreground': 'hsl(var(--info-foreground) / <alpha-value>)',
				'observation-background': 'hsl(var(--observation-background) / <alpha-value>)',
				'observation-foreground': 'hsl(var(--observation-foreground) / <alpha-value>)',
				'feelings-background': 'hsl(var(--feelings-background) / <alpha-value>)',
				'feelings-foreground': 'hsl(var(--feelings-foreground) / <alpha-value>)',
				'needs-background': 'hsl(var(--needs-background) / <alpha-value>)',
				'needs-foreground': 'hsl(var(--needs-foreground) / <alpha-value>)',
				'request-background': 'hsl(var(--request-background) / <alpha-value>)',
				'request-foreground': 'hsl(var(--request-foreground) / <alpha-value>)',
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				neon: 'hsl(var(--neon) / <alpha-value>)',
				offwhite: 'hsl(var(--offwhite) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter, sans-serif'],
				display: ['Inter Tight, sans-serif']
			}
		}
	}
};

export default config;
