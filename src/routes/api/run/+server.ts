import { getRunner } from '$lib/server/run/index.js';
import { RunnerError, type IRunnerResult } from '$lib/server/run/runner.js';
import { json, text } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { formSchema } from './schema.js';
export type ApiRunResponse = IRunnerResult;
export async function POST({ request, locals }) {
	if (!locals.user) {
		return text('Forbidden', { status: 403 });
	}
	try {
		const body = formSchema.parse(await request.json());

		const runner = getRunner(body.lang)!;
		const res = await runner.run(body.code, body.testcases);

		return json(res);
	} catch (error) {
		console.error(error);
		if (error instanceof RunnerError) {
			return text(error.message, { status: 400 });
		}
		if (error instanceof ZodError) {
			return text(error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n'), {
				status: 400
			});
		}
		throw error;
	}
}
