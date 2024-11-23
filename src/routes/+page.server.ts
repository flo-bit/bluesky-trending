import { getAllLanguages, getLastUpdateTimestamp, getTopHashtags } from '$lib';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const languages = (await getAllLanguages()).sort((a: string, b: string) => a.localeCompare(b));

	const lastHourTags = await getTopHashtags(1, 'en');
	const last24HourTags = await getTopHashtags(24, 'en');

	const lastUpdateTimestamp = (await getLastUpdateTimestamp()) ?? new Date().getTime() * 1000;

	return {
		languages,
		lastHourTags,
		last24HourTags,
		languageCode: 'en',
		lastUpdateTimestamp: lastUpdateTimestamp as number
	};
}
