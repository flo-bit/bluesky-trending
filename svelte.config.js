import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export const languageEmojis = {
	zh: '🇨🇳', // Chinese
	ur: '🇵🇰', // Urdu
	en: '🇺🇸', // English
	es: '🇪🇸', // Spanish
	pt: '🇧🇷', // Portuguese
	hi: '🇮🇳', // Hindi
	ar: '🇸🇦', // Arabic
	bn: '🇧🇩', // Bengali
	ru: '🇷🇺', // Russian
	ja: '🇯🇵', // Japanese
	id: '🇮🇩', // Indonesian
	fr: '🇫🇷', // French
	de: '🇩🇪', // German
	tr: '🇹🇷', // Turkish
	vi: '🇻🇳', // Vietnamese
	ko: '🇰🇷', // Korean
	fa: '🇮🇷', // Persian (Farsi)
	th: '🇹🇭', // Thai
	it: '🇮🇹', // Italian
	uk: '🇺🇦' // Ukrainian
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		paths: {
			base: '/bluesky-trending'
		},
		prerender: {
			entries: ['/', ...Object.keys(languageEmojis).map((lang) => `/${lang}`)]
		}
	}
};

export default config;
