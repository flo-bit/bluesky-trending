import {
	getAllLanguages,
	getLastUpdateTimestamp,
	getTopHashtagsLastHour,
	getTopHashtagsLast24Hours
} from '$lib';
import { languageEmojis } from '$lib/emojis';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const languages = (await getAllLanguages())
		.sort((a: string, b: string) => a.localeCompare(b))
		.filter((lang) => languageEmojis[lang]);

	const lastHourTags = await getTopHashtagsLastHour('en');
	const last24HourTags = await getTopHashtagsLast24Hours('en');

	const lastUpdateTimestamp = (await getLastUpdateTimestamp()) ?? new Date().getTime() * 1000;

	return {
		languages,
		lastHourTags,
		last24HourTags,
		languageCode: 'en',
		lastUpdateTimestamp: lastUpdateTimestamp as number
	};
}
