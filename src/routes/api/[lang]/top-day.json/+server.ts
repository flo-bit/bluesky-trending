export const prerender = true;

import { getLastUpdateTimestamp, getTopHashtagsLast24Hours } from '$lib';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const languageCode = params.lang ?? 'en';

	const lastDay = await getTopHashtagsLast24Hours(languageCode);

	const lastUpdateTimestamp = await getLastUpdateTimestamp();

	if (!lastUpdateTimestamp) {
		return json({ tags: lastDay });
	}

	return json({ tags: lastDay, 'last-update': new Date(lastUpdateTimestamp / 1000 + 5000) });
};
