// import { VitePWA } from 'vite-plugin-pwa';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit()
		// VitePWA({
		// 	registerType: 'autoUpdate',
		// 	manifest: {
		// 		name: 'FreeSpeech AAC',
		// 		short_name: 'FreeSpeech',
		// 		description: 'Free & Open-Source AAC, For Everyone.',
		// 		theme_color: '#ffffff',
		// 		icons: [
		// 			{
		// 				src: 'favicon.png',
		// 				sizes: '192x192',
		// 				type: 'image/png'
		// 			},
		// 			{
		// 				src: 'favicon.png',
		// 				sizes: '512x512',
		// 				type: 'image/png'
		// 			}
		// 		]
		// 	}
		// })
	]
});
