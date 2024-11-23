import { getAllLanguages, getTopHashtags } from '$lib';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const languages = (await getAllLanguages()).sort((a: string, b: string) => a.localeCompare(b));

	const lastHourTags = await getTopHashtags(1, 'en');
	const last24HourTags = await getTopHashtags(24, 'en');

	return { languages, lastHourTags, last24HourTags, languageCode: 'en' };
}
