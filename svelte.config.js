// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
// import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors

	preprocess: [vitePreprocess({})],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			// pages: 'dist',
			// assets: 'dist',
			// fallback: null,
			// precompress: false,
			// strict: true
			// strict: false,
			// prefetch: {
			// 	enabled: false,
			// }
		}),
		alias: {
			$static: "static",
			$assets: "src/assets",
			$routes: "src/routes",
			$scripts: "src/scripts",
			$store: "src/store",
			$src: "src",
		},
	},

	
};

export default config;
