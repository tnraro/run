import { ps } from '$lib/server/ps/ps';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { searchSchema } from './schema';

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(searchSchema));
		if (!event.locals.user) {
			return fail(403, { form });
		}
		if (!form.valid) {
			return fail(400, { form });
		}

		const url = form.data.url;

		const path = `/p/${url.slice(new URL(url).protocol.length + 2)}`;

		for (const p of ps) {
			if (p.test(url)) {
				redirect(302, path);
			}
		}

		fail(404, { form });
	}
} satisfies Actions;
