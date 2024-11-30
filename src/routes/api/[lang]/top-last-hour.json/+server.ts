export const prerender = true;

import { getLastUpdateTimestamp, getTopHashtagsLastHour } from '$lib';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const languageCode = params.lang ?? 'en';

	const lastHourTags = await getTopHashtagsLastHour(languageCode);

	const lastUpdateTimestamp = await getLastUpdateTimestamp();

	if (!lastUpdateTimestamp) {
		return json({ tags: lastHourTags });
	}

	return json({ tags: lastHourTags, 'last-update': new Date(lastUpdateTimestamp / 1000 + 5000) });
};
