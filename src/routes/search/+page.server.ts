import { ps } from '$lib/server/ps/ps';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const url = form.get('url') as string;

		const path = `/p/${url.slice(new URL(url).protocol.length + 2)}`;

		console.log(path);

		for (const p of ps) {
			if (p.test(url)) {
				redirect(302, path);
			}
		}

		fail(404);
	}
} satisfies Actions;
