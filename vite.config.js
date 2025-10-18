import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
			mode: 'development',
			strategies: 'injectManifest',
			filename: 'service-worker.ts',
			registerType: 'autoUpdate',
			manifest: {
				short_name: 'setlist',
				name: 'setlist - chord sheets & tabs',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: '#ff436c',
				background_color: '#000000',
				icons: [
					{
						src: '/favicon.ico',
						sizes: '64x64 32x32 24x24 16x16',
						type: 'image/x-icon'
					},
					{
						src: '/icon-192.png',
						type: 'image/png',
						sizes: '192x192'
					},
					{
						src: '/icon-512.png',
						type: 'image/png',
						sizes: '512x512'
					}
				]
			},
			injectManifest: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}']
			},
			devOptions: {
				enabled: true,
				type: 'module'
			}
		})
	]
});
