import { dev } from '$app/environment';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { count, eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export async function load(event) {
	if (event.locals.user) redirect(302, '/');

	const target = (await userCount()) === 0 ? 'register' : 'login';

	return {
		form: await superValidate(zod(formSchema)),
		target
	};
}

export const actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(formSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if ((await userCount()) !== 1) return fail(400, { form });

		const results = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, form.data.username));

		const existingUser = results.at(0);
		if (!existingUser) {
			return setError(form, 'password', 'Incorrect username or password');
		}

		const validPassword = await verify(existingUser.passwordHash, form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return setError(form, 'password', 'Incorrect username or password');
		}

		const session = await auth.createSession(existingUser.id);
		event.cookies.set(auth.sessionCookieName, session.id, {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			expires: session.expiresAt,
			secure: !dev
		});

		redirect(302, '/');
	},
	register: async (event) => {
		const form = await superValidate(event, zod(formSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if ((await userCount()) !== 0) return fail(400, { form });

		const userId = crypto.randomUUID();
		const passwordHash = await hash(form.data.password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db
				.insert(table.user)
				.values({ id: userId, username: form.data.username, passwordHash });

			const session = await auth.createSession(userId);
			event.cookies.set(auth.sessionCookieName, session.id, {
				path: '/',
				sameSite: 'lax',
				httpOnly: true,
				expires: session.expiresAt,
				secure: !dev
			});
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/');
	}
};

async function userCount() {
	const a = await db.select({ count: count() }).from(table.user);
	return a.at(0)?.count ?? 0;
}
