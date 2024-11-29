import { languageEmojis } from '$lib/emojis';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const languages = Object.keys(languageEmojis);

	return json({ languages });
};
