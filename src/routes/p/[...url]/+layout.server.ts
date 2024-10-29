import { ps } from '$lib/server/ps/ps.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const url = `https://${params.url}`;
	for (const p of ps) {
		if (p.test(url)) {
			return await p.get(url);
		}
	}
	error(404, 'Not Found');
};
