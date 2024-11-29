import { API_URL } from '$env/static/private';

// Function to get all languages in the database
export async function getAllLanguages() {
	const response = await fetch(API_URL + '/api/languages');
	return response.json();
}

// Function to get top 100 hashtags of the last hour
export async function getTopHashtagsLastHour(lang: string) {
	const response = await fetch(
		API_URL + '/api/top-hashtags/last-hour' + (lang ? `?lang=${lang}` : '')
	);
	return response.json();
}

// Function to get top 100 hashtags of the last 24 hours
export async function getTopHashtagsLast24Hours(lang: string) {
	const response = await fetch(
		API_URL + '/api/top-hashtags/last-24-hours' + (lang ? `?lang=${lang}` : '')
	);
	return response.json();
}

// Function to get the last update timestamp
export async function getLastUpdateTimestamp() {
	const response = await fetch(API_URL + '/api/last-update-timestamp');
	const data = await response.json();
	return data.last_timestamp;
}
