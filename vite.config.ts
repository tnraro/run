import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	optimizeDeps: {
		exclude: [
			'svelte-codemirror-editor',
			'codemirror',
			'@codemirror/lang-cpp',
			'@fsegurai/codemirror-theme-gruvbox-dark'
		]
	}
});
