import { json, text } from '@sveltejs/kit';
import { formSchema } from './schema.js';
import { buildAndRun, GccError } from '$lib/server/run/gcc/index.js';
import { ZodError } from 'zod';
export type ApiPResponse = Awaited<ReturnType<typeof buildAndRun>>;
export async function POST({ request, locals }) {
	if (!locals.user) {
		return text('Forbidden', { status: 403 });
	}
	const body = formSchema.parse(await request.json());

	try {
		const res = await buildAndRun(body.code, body.testcases);

		return json(res);
	} catch (error) {
		console.error(error);
		if (error instanceof GccError) {
			return text(error.message, { status: 400 });
		}
		if (error instanceof ZodError) {
			return text(error.message, { status: 400 });
		}
		throw error;
	}
}
