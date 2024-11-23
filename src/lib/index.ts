import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '$env/static/private';
import { createClient } from '@libsql/client';

const client = createClient({
	url: TURSO_DATABASE_URL, // Your Turso database URL
	authToken: TURSO_AUTH_TOKEN // Your Turso authentication token
});

// Function to get all languages in the database
export async function getAllLanguages() {
	const result = await client.execute({
		sql: `SELECT DISTINCT lang FROM hashtags WHERE lang IS NOT NULL;`,
		args: []
	});
	return result.rows.map((row) => row.lang);
}

// Helper function to get top hashtags within a specified time frame
export async function getTopHashtags(hours: number, lang: string | null = null) {
	const timestampThreshold = Date.now() * 1000 - hours * 3600 * 1000_000;
	let sql = `
        SELECT tag, SUM(count) AS total_count
        FROM hashtags
        WHERE timestamp >= ?
    `;
	const args: (number | string)[] = [timestampThreshold];

	if (lang) {
		if (lang === 'en') {
			sql += ` AND (lang = ? OR lang = '')`;
			args.push(lang);
		} else {
			sql += ` AND lang = ?`;
			args.push(lang);
		}
	}

	sql += `
        GROUP BY tag
        ORDER BY total_count DESC
        LIMIT 50;
    `;

	const result = await client.execute({ sql, args });
	return result.rows;
}

// Function to get top 100 hashtags of the last hour
export async function getTopHashtagsLastHour(lang = null) {
	return await getTopHashtags(1, lang);
}

// Function to get top 100 hashtags of the last 24 hours
export async function getTopHashtagsLast24Hours(lang = null) {
	return await getTopHashtags(24, lang);
}

// Function to get the last update timestamp
export async function getLastUpdateTimestamp() {
	const result = await client.execute({
		sql: `SELECT MAX(timestamp) AS last_timestamp FROM hashtags;`,
		args: []
	});
	return result.rows[0].last_timestamp;
}
