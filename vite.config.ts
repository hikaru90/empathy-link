import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// resolve:{
	//   preserveSymlinks: false,
	// },
	ssr: {
		noExternal: ['three']
	},
	server: {
		// host: '0.0.0.0',
		port: 3000,
		watch: {
			usePolling: true,
			interval: 200 // Increase interval if necessary
		}
	},
	preview: {
		port: 8080
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler' // or "modern"
			}
		}
	},
	optimizeDeps: {
		exclude: [
			'@sveltekit-i18n/parser-default',
			'devalue',
			'resize-observer-polyfill',
			'posthog-js',
			'clsx',
			'tailwind-merge',
			'tailwind-variants',
			'dequal',
			'nanoid/non-secure',
			'@internationalized/date',
			'@floating-ui/dom',
			'focus-trap',
			'marked',
			'pocketbase',
			'lucide-svelte'
		] // Exclude dependencies if they don't need optimization
	}
});
