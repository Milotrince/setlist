import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import { mdsvex } from 'mdsvex'
import { songPreprocessor } from './src/lib/songPreprocessor.js';

// eslint-disable-next-line no-unused-vars
/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: [".svelte", ".svx", ".md"],
	preprocess: [
        preprocess({
            sass: {
                prependData: "@import './src/app.sass';",
                includePaths: ['node_modules'],
            },
        }),
        songPreprocessor(),
        mdsvex({
            extensions: ['.md', '.svx'],
        })
    ],
	// Remove vite-plugin-svelte warnings about unused CSS selectors
	onwarn: (warning, handler) => {
		const { code, frame } = warning;
		if (code === 'css-unused-selector') return;
		handler(warning);
	},
	kit: {
		adapter: adapter()
	}
};

export default config;