import { ps } from '$lib/server/ps/ps.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}
	const url = `https://${params.url}`;
	const problem = await findProblem(url);
	if (problem == null) error(404, 'Not Found');

	return {
		id: params.url,
		problem
	};
	async function findProblem(url: string) {
		for (const p of ps) {
			if (p.test(url)) return await p.get(url);
		}
		return;
	}
};
