import { getAllLanguages, getLastUpdateTimestamp, getTopHashtags } from '$lib';
import { languageEmojis } from '$lib/emojis.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const languageCode = params.lang;

	const languages = (await getAllLanguages())
		.sort((a: string, b: string) => a.localeCompare(b))
		.filter((lang) => languageEmojis[lang]);

	const lastHourTags = await getTopHashtags(1, languageCode);
	const last24HourTags = await getTopHashtags(24, languageCode);

	const lastUpdateTimestamp = (await getLastUpdateTimestamp()) ?? new Date().getTime() * 1000;

	return {
		languages,
		lastHourTags,
		last24HourTags,
		languageCode,
		lastUpdateTimestamp: lastUpdateTimestamp as number
	};
}
