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
    port: 3000,
  },
  preview: {
    port: 8080,
  },
});
