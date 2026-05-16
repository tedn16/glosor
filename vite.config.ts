import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Set GH Pages base path. Override with VITE_BASE env var if hosting elsewhere.
const base = process.env.VITE_BASE ?? '/glosor/';

export default defineConfig({
  base,
  plugins: [svelte()],
});
