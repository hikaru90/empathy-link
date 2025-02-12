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
  },
  preview: {
    port: 8080,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  }
});
